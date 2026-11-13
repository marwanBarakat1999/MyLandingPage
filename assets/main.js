/* marwanmagdy.com — behaviour: theme, call trace, tabs, gadget demo */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme ---------- */
  function setTheme(mode) {
    document.documentElement.setAttribute("data-theme", mode);
    try { localStorage.setItem("mm-theme", mode); } catch (e) {}
    var btns = document.querySelectorAll("[data-theme-toggle]");
    for (var i = 0; i < btns.length; i++) {
      var label = btns[i].querySelector("[data-theme-label]");
      if (label) label.textContent = mode === "light" ? "Dark" : "Light";
      btns[i].setAttribute("aria-label", mode === "light" ? "Switch to dark theme" : "Switch to light theme");
    }
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-theme-toggle]") : null;
    if (!btn) return;
    setTheme(document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light");
  });
  setTheme(document.documentElement.getAttribute("data-theme") || "dark");

  /* ---------- call trace ---------- */
  var trace = document.querySelector("[data-trace]");
  if (trace) {
    var hops = Array.prototype.slice.call(trace.querySelectorAll(".hop"));
    var panel = trace.querySelector("[data-trace-panel]");
    var fill = trace.querySelector(".trace__fill");
    var glow = trace.querySelector(".trace__glow");
    var counter = trace.querySelector("[data-trace-count]");
    var toggle = trace.querySelector("[data-trace-toggle]");
    var fields = {
      title: panel.querySelector("[data-f-title]"),
      what: panel.querySelector("[data-f-what]"),
      run: panel.querySelector("[data-f-run]"),
      tool: panel.querySelector("[data-f-tool]"),
      toolLine: panel.querySelector("[data-f-toolline]")
    };
    var data = hops.map(function (h) {
      return {
        title: h.getAttribute("data-title"),
        what: h.getAttribute("data-what"),
        run: h.getAttribute("data-run"),
        tool: h.getAttribute("data-tool"),
        href: h.getAttribute("data-href"),
        toolLine: h.getAttribute("data-toolline")
      };
    });
    var at = 0;
    var playing = !reduce;
    var timer = null;

    function render(i) {
      at = i;
      hops.forEach(function (h, n) {
        h.setAttribute("aria-selected", n === i ? "true" : "false");
        h.setAttribute("tabindex", n === i ? "0" : "-1");
        h.setAttribute("data-state", n < i ? "past" : (n === i ? "now" : "next"));
      });
      var d = data[i];
      fields.title.textContent = d.title;
      fields.what.textContent = d.what;
      fields.run.textContent = d.run;
      fields.tool.textContent = d.tool;
      fields.tool.setAttribute("href", d.href);
      fields.toolLine.textContent = d.toolLine;
      fill.style.width = (i / (hops.length - 1) * 100) + "%";
      glow.style.left = ((1 + 2 * i) / (hops.length * 2) * 100) + "%";
      if (counter) counter.textContent = ("0" + (i + 1)).slice(-2);
      panel.classList.remove("is-fading");
      void panel.offsetWidth;
      panel.classList.add("is-fading");
    }

    function start() {
      if (reduce || timer) return;
      timer = setInterval(function () {
        if (playing) render((at + 1) % hops.length);
      }, 3800);
    }
    function stopAuto() {
      playing = false;
      if (toggle) toggle.textContent = "Play";
    }

    hops.forEach(function (h, i) {
      h.addEventListener("click", function () { stopAuto(); render(i); });
      h.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = (i + 1) % hops.length;
        if (e.key === "ArrowLeft") n = (i - 1 + hops.length) % hops.length;
        if (e.key === "Home") n = 0;
        if (e.key === "End") n = hops.length - 1;
        if (n === null) return;
        e.preventDefault();
        stopAuto();
        render(n);
        hops[n].focus();
      });
    });

    if (toggle) {
      toggle.textContent = playing ? "Pause" : "Play";
      toggle.addEventListener("click", function () {
        playing = !playing;
        toggle.textContent = playing ? "Pause" : "Play";
      });
    }

    if ("IntersectionObserver" in window) {
      var seen = true;
      new IntersectionObserver(function (entries) {
        seen = entries[0].isIntersecting;
        if (!seen && timer) { clearInterval(timer); timer = null; }
        else if (seen) start();
      }, { threshold: 0.15 }).observe(trace);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden && timer) { clearInterval(timer); timer = null; }
      else if (!document.hidden) start();
    });

    render(0);
    start();
  }

  /* ---------- tabs ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-tabs]"), function (group) {
    var btns = Array.prototype.slice.call(group.querySelectorAll("[role=tab]"));
    function show(i) {
      btns.forEach(function (b, n) {
        b.setAttribute("aria-selected", n === i ? "true" : "false");
        b.setAttribute("tabindex", n === i ? "0" : "-1");
        var p = document.getElementById(b.getAttribute("aria-controls"));
        if (p) p.hidden = n !== i;
      });
    }
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () { show(i); });
      b.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = (i + 1) % btns.length;
        if (e.key === "ArrowLeft") n = (i - 1 + btns.length) % btns.length;
        if (n === null) return;
        e.preventDefault();
        show(n);
        btns[n].focus();
      });
    });
    show(0);
  });

  /* ---------- end call gadget demo ---------- */
  var demo = document.querySelector("[data-demo]");
  if (demo) {
    var el = {
      state: demo.querySelector("[data-d-state]"),
      stateWrap: demo.querySelector("[data-d-statewrap]"),
      var10: demo.querySelector("[data-d-var]"),
      ctl: demo.querySelector("[data-d-ctl]"),
      bug: demo.querySelector("[data-d-bug]"),
      verdict: demo.querySelector("[data-d-verdict]"),
      note: demo.querySelector("[data-d-note]"),
      log: demo.querySelector("[data-d-log]"),
      consult: demo.querySelector("[data-a-consult]"),
      hold: demo.querySelector("[data-a-hold]"),
      handset: demo.querySelector("[data-a-handset]"),
      customer: demo.querySelector("[data-a-customer]"),
      reset: demo.querySelector("[data-a-reset]"),
      vbtns: Array.prototype.slice.call(demo.querySelectorAll("[data-version]"))
    };
    var S = null;

    function fresh(v) {
      return { v: v, phase: "talking", var10: "N", endedBy: "", stuck: false, n: 0,
               log: [{ t: "00:00", text: "Call delivered to agent · TALKING", c: "var(--ok)" }] };
    }
    function add(text, c) {
      S.n += 1;
      var sec = 14 + S.n * 9;
      S.log.unshift({ t: "0" + Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2), text: text, c: c || "var(--ink)" });
      S.log = S.log.slice(0, 7);
    }
    function paint() {
      var v22 = S.v === "2.2";
      var ended = S.phase === "ended";
      var hold = S.phase === "hold";
      var consult = S.phase === "consult";

      var names = { talking: "Talking", consult: "On consult", hold: "On hold", ended: "Ended" };
      var colors = { talking: "var(--ok)", consult: "var(--warn)", hold: "var(--warn)", ended: "var(--muted)" };
      el.state.textContent = names[S.phase];
      el.stateWrap.style.color = colors[S.phase];
      el.var10.textContent = S.var10 === "Y" ? "Y" : "not set";
      el.var10.style.color = S.var10 === "Y" ? "var(--accent)" : "var(--muted)";

      el.ctl.innerHTML = "";
      if (ended) {
        var e1 = document.createElement("div");
        e1.className = "ended-note";
        e1.textContent = "Call ended";
        el.ctl.appendChild(e1);
      } else if (hold && v22) {
        var e2 = document.createElement("div");
        e2.className = "hidden-note";
        e2.innerHTML = "Customer on hold. <b>Retrieve first</b> to end the call.";
        el.ctl.appendChild(e2);
      } else {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "endbtn" + (S.phase === "talking" ? "" : " hold");
        b.textContent = S.phase === "talking" ? "END CALL" : (consult ? "ON CONSULT · CLICK TO END CONSULT" : "ON HOLD · CLICK TO END");
        b.addEventListener("click", press);
        el.ctl.appendChild(b);
      }

      el.bug.hidden = !S.stuck;
      el.consult.disabled = S.phase !== "talking";
      el.hold.disabled = !(S.phase === "talking" || hold);
      el.hold.textContent = hold ? "Retrieve customer" : "Put on hold";
      el.handset.disabled = ended;
      el.customer.disabled = ended;

      var vb, vn, vt;
      if (!ended && !S.stuck) { vb = "Call in progress"; vn = "var(--muted)"; vt = "The report fills in when the call ends."; }
      else if (S.stuck) { vb = "Agent · desktop ?"; vn = "var(--accent)"; vt = "The record says the agent ended it, yet the customer is still waiting on hold."; }
      else if (S.endedBy === "agent") { vb = "Agent · desktop"; vn = "var(--ok)"; vt = "callVariable10 = Y: ended with the gadget."; }
      else if (S.endedBy === "phone") { vb = "Phone"; vn = "var(--warn)"; vt = "The agent ended it, but not with the gadget, so it was the handset."; }
      else { vb = "Customer"; vn = "var(--ink)"; vt = "The disconnect came from the caller's side."; }
      el.verdict.textContent = vb;
      el.verdict.style.color = vn;
      el.note.textContent = vt;

      el.log.innerHTML = "";
      S.log.forEach(function (e) {
        var li = document.createElement("li");
        var t = document.createElement("span");
        t.className = "t";
        t.textContent = e.t;
        var x = document.createElement("span");
        x.textContent = e.text;
        x.style.color = e.c;
        li.appendChild(t);
        li.appendChild(x);
        el.log.appendChild(li);
      });

      el.vbtns.forEach(function (b2) {
        b2.setAttribute("aria-pressed", b2.getAttribute("data-version") === S.v ? "true" : "false");
      });
    }
    function press() {
      if (S.phase === "talking") {
        add("PUT /Dialog/{id} · DROP → 202", "var(--warn)");
        add("callVariable10 = Y · call ended", "var(--ok)");
        S.phase = "ended"; S.var10 = "Y"; S.endedBy = "agent";
      } else if (S.phase === "consult") {
        add("Consult leg dropped · customer still on hold", "var(--warn)");
        S.phase = "hold";
      } else if (S.phase === "hold") {
        add("DROP sent to a held call · callVariable10 = Y", "var(--accent)");
        add("Call is still on hold", "var(--accent)");
        S.var10 = "Y"; S.stuck = true;
      }
      paint();
    }
    function boot(v) { S = fresh(v); paint(); }

    el.consult.addEventListener("click", function () {
      add("Customer held · consult to supervisor group", "var(--warn)");
      S.phase = "consult"; paint();
    });
    el.hold.addEventListener("click", function () {
      if (S.phase === "talking") { add("Customer put on hold", "var(--warn)"); S.phase = "hold"; }
      else if (S.phase === "hold") {
        if (S.stuck) add("Retrieve failed · call returned to hold", "var(--accent)");
        else { add("Customer retrieved · TALKING", "var(--ok)"); S.phase = "talking"; }
      }
      paint();
    });
    el.handset.addEventListener("click", function () {
      add("Agent hung up on the handset"); S.phase = "ended"; S.endedBy = "phone"; paint();
    });
    el.customer.addEventListener("click", function () {
      add("Customer disconnected"); S.phase = "ended"; S.endedBy = "customer"; paint();
    });
    el.reset.addEventListener("click", function () { boot(S.v); });
    el.vbtns.forEach(function (b) {
      b.addEventListener("click", function () { boot(b.getAttribute("data-version")); });
    });

    boot("2.2");
  }

  /* ---------- year ---------- */
  Array.prototype.forEach.call(document.querySelectorAll("[data-year]"), function (n) {
    n.textContent = new Date().getFullYear();
  });
})();
