import parser from "https://code4fukui.github.io/ruby_parser/RubyParser.js";

export const execRuby = async (src, opts = {}) => {
  const funcs = opts.funcs || {};
  const abortctrl = opts.abortctrl;
  const output = opts.output || ((s) => console.log(s));
  const debug = opts.debug;

  const globalvars = {};
  let vars = {};
  const setVar = (name, v) => {
    if (name[0] == "$") {
      globalvars[name] = v;
    } else {
      vars[name] = v;
    }
    return v;
  };
  const getVar = (name) => {
    if (name[0] == "$") {
      return globalvars[name];
    }
    return vars[name];
  };
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
    if (ast.statements) {
      let val = null;
      for (const st of ast.statements) {
        val = await exec(st);
      }
      return val;
    } else if (ast.cond) {
      if (ast.body) { // while } || (!ast.if_true && !ast.if_false)) { // loop
        for (;;) {
          const flg = await exec(ast.cond);
          if (!flg) {
            break;
          }
          if (ast.body) await exec(ast.body);
          await sleepRuby(0.001); // enable interrupt
        }
      } else { // if
        const flg = await exec(ast.cond);
        if (flg && ast.if_true) {
          await exec(ast.if_true);
        } else if (!flg && ast.if_false) {
          await exec(ast.if_false);
        }
      }
    } else if (ast.iterator) { // for
      const vname = ast.iterator.name;
      const start = await exec(ast.iteratee.left);
      const end = await exec(ast.iteratee.right);
      for (let i = start; i <= end; i++) {
        vars[vname] = i;
        await exec(ast.body);
      }
    } else if (ast.method_name) {
      const fn = ast.method_name;
      const recv = ast.recv ? await exec(ast.recv) : null;
      const args = [];
      for (const a of ast.args) {
        args.push(await exec(a));
      }
      if (!recv) { // procedure
        if (fn == "sleep") {
          await sleepRuby(args[0]);
        } else if (fn == "puts" || fn == "p") {
          //console.log(...args.map(a => a.raw ? new TextDecoder().decode(a.raw) : a));
          output(args.join(" "));
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
            //console.log(localvars);
            const res = await exec(localf.body);
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
        } else if (fn == "+") {
          const res = parseFloat(recv) + parseFloat(args[0]);
          if (!isNaN(res)) {
            return res;
          }
          return recv + args[0];
        } else if (fn == "-@") {
          return -parseFloat(recv);
        } else if (fn == "-") {
          return parseFloat(recv) - parseFloat(args[0]);
        } else if (fn == "*") {
          return parseFloat(recv) * parseFloat(args[0]);
        } else if (fn == "/") {
          return parseFloat(recv) / parseFloat(args[0]);
        } else if (fn == "%") {
          return parseFloat(recv) % parseFloat(args[0]);
        } else if (fn == "<") {
          return parseFloat(recv) < parseFloat(args[0]);
        } else if (fn == "<=") {
          return parseFloat(recv) <= parseFloat(args[0]);
        } else if (fn == ">") {
          return parseFloat(recv) > parseFloat(args[0]);
        } else if (fn == ">=") {
          return parseFloat(recv) >= parseFloat(args[0]);
        } else {
          throw new Error("undef fn: " + fn)
        }
      }
    } else if (ast.name) {
      if (!ast.body) {
        if (ast.value) {
          setVar(ast.name, await exec(ast.value));
        }
        return getVar(ast.name);
      } else {
        localfuncs[ast.name] = ast;
        return null;
      }
    } else if (ast.value) {
      if (ast.value.raw) {
        const r = ast.value.raw;
        const a = new Uint8Array(Object.keys(r).length);
        for (let i = 0; i < a.length; i++) {
          a[i] = r[i];
        }
        return new TextDecoder().decode(a);
      }
      return ast.value;
    } else {
      return true;
    }
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
