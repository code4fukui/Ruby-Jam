import parser from "https://code4fukui.github.io/ruby_parser/RubyParser.js";

class Break {};
class Next {};
class Return {
  constructor(v) {
    this.value = v;
  }
};

export const execRuby = async (src, opts = {}) => {
  const funcs = opts.funcs || {};
  const abortctrl = opts.abortctrl;
  const output = opts.output || ((s) => console.log(s));
  const debug = opts.debug;

  const globalvars = {};
  let vars = {};

  const varstack = [];

  let flgstop = false;
  const localfuncs = {}

  let tsleep = null;
  let treject = null;
  const sleepRuby = (sec) => new Promise((res, reject) => {
    tsleep = setTimeout(res, sec * 1000);
    treject = reject;
  });
  const interruptSleep = () => {
    clearTimeout(tsleep);
    if (treject) treject();
  };
  
  const exec = async (ast) => {
    if (flgstop) {
      throw new Error("interrupted");
    }
    if (!ast) {
      throw new Error("ast is null");
    }
    const astname = ast.constructor.name;
    //console.log({astname})
    if (astname == "Begin") {
      let val = null;
      for (const st of ast.statements) {
        val = await exec(st);
        await sleepRuby(0.001); // enable interrupt
      }
      return val;
    } else if (astname == "If") {
      const flg = await exec(ast.cond);
      if ((flg != 0) && ast.if_true) {
        await exec(ast.if_true);
      } else if (!flg && ast.if_false) {
        await exec(ast.if_false);
      }
      return;
    } else if (astname == "While") {
      for (;;) {
        const flg = await exec(ast.cond);
        if (!flg) {
          break;
        }
        try {
          if (ast.body) await exec(ast.body);
        } catch (e) {
          if (e instanceof Break) {
            break;
          } else if (e instanceof Next) {
            continue;
          } else {
            throw e;
          }
        }
        await sleepRuby(0.001); // enable interrupt
      }
      return;
    } else if (astname == "Until") {
      for (;;) {
        const flg = await exec(ast.cond);
        if (flg) {
          break;
        }
        try {
          if (ast.body) await exec(ast.body);
        } catch (e) {
          if (e instanceof Break) {
            break;
          } else if (e instanceof Next) {
            continue;
          } else {
            throw e;
          }
        }
        await sleepRuby(0.001); // enable interrupt
      }
      return;
    } else if (astname == "For") {
      const vname = ast.iterator.name;
      const start = await exec(ast.iteratee.left);
      const end = await exec(ast.iteratee.right);
      for (let i = start; i <= end; i++) {
        vars[vname] = i;
        try {
          if (ast.body) await exec(ast.body);
        } catch (e) {
          if (e instanceof Break) {
            break;
          } else if (e instanceof Next) {
            continue;
          } else {
            throw e;
          }
        }
      }
      return;
    } else if (astname == "Block") { // loop
      for (;;) {
        try {
          if (ast.body) await exec(ast.body);
        } catch (e) {
          if (e instanceof Break) {
            break;
          } else if (e instanceof Next) {
            continue;
          } else {
            throw e;
          }
        }
        await sleepRuby(0.001); // enable interrupt
      }
      return;
    } else if (astname == "Break") {
      throw new Break();
    } else if (astname == "Next") {
      throw new Next();
    } else if (astname == "Send") {
      const fn = ast.method_name;
      const recv = ast.recv ? await exec(ast.recv) : undefined;
      const args = [];
      for (const a of ast.args) {
        args.push(await exec(a));
      }
      if (recv === undefined) { // procedure
        if (fn == "sleep") {
          return await sleepRuby(args[0]);
        } else if (fn == "puts" || fn == "p") {
          //console.log(...args.map(a => a.raw ? new TextDecoder().decode(a.raw) : a));
          output(args.join(" "));
          return;
        } else {
          const localf = localfuncs[fn];
          if (localf) {
            varstack.push(vars);
            vars = {};
            if (localf.args) {
              //console.log("len", localf.args.args, localf.args.length)
              const largs = localf.args.args;
              for (let i = 0; i < largs.length; i++) {
                const name = largs[i].name;
                vars[name] = args[i];
              }
            }
            let res = undefined;
            try {
              res = await exec(localf.body);
            } catch (e) {
              if (!(e instanceof Return)) {
                throw e;
              }
              res = e.value;
            }
            vars = varstack.pop();
            return res;
          }
          const f = funcs[fn];
          if (f) {
            return await f(...args);
          }
          throw new Error("undef procedure: " + fn);
        }
      } else {
        if (fn == "==") {
          return recv == args[0];
        } else if (fn == "-@") {
          return -recv;
        } else if (fn == "!") {
          return !recv;
        } else if (fn == "-") {
          return recv - args[0];
        } else if (fn == "+") {
          return recv + args[0];
        } else if (fn == "*") {
          return recv * args[0];
        } else if (fn == "/") {
          return recv / args[0];
        } else if (fn == "%") {
          return recv % args[0];
        } else if (fn == "<") {
          return recv < args[0];
        } else if (fn == "<=") {
          return recv <= args[0];
        } else if (fn == ">") {
          return recv > args[0];
        } else if (fn == ">=") {
          return recv >= args[0];
        } else {
          throw new Error("undef fn: " + fn)
        }
      }
    } else if (astname == "Return") {
      const v = await exec(ast.args[0]);
      throw new Return(v);
    } else if (astname == "Or") {
      const res = await exec(ast.lhs);
      if (res) return res;
      return await exec(ast.rhs);
    } else if (astname == "And") {
      const res = await exec(ast.lhs);
      if (!res) return res;
      return await exec(ast.rhs);
    } else if (astname == "Def") {
      localfuncs[ast.name] = ast;
      return null;
    } else if (astname == "Lvasgn") {
      return vars[ast.name] = await exec(ast.value);
    } else if (astname == "Gvasgn") {
      return globalvars[ast.name] = await exec(ast.value);
    } else if (astname == "Lvar") {
      return vars[ast.name];
    } else if (astname == "Gvar") {
      return globalvars[ast.name];
    } else if (astname == "Int") {
      return parseInt(ast.value);
    } else if (astname == "Float") {
      return parseFloat(ast.value);
    } else if (astname == "Str") {
      if (ast.value.raw) {
        const r = ast.value.raw;
        const a = new Uint8Array(Object.keys(r).length);
        for (let i = 0; i < a.length; i++) {
          a[i] = r[i];
        }
        return new TextDecoder().decode(a);
      }
    } else if (astname == "True") {
      return true;
    } else if (astname == "False") {
      return false;
    }
    //console.log(JSON.stringify(ast, null, 2));
    throw new Error("unsupported astname: " + astname);
  };
  
  const p = parser.parse(src);
  if (debug) {
    console.log(JSON.stringify(p, null, 2));
  }
  if (p.diagnostics.filter(d => d.level == "error").length > 0) {
    throw new Error(JSON.stringify(p.diagnostics, null, 2));
  }
  //console.log(JSON.stringify(p.ast, null, 2));
  if (abortctrl) {
    abortctrl.signal.addEventListener("abort", () => {
      interruptSleep();
      flgstop = true;
    });
  }
  return exec(p.ast);
};
