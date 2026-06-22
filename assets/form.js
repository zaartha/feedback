// Shared form utilities

function buildRatings(groups) {
  groups.forEach(function(g) {
    var row = document.getElementById(g.rowId);
    if (!row) return;
    for (var i = 1; i <= 5; i++) {
      (function(val) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'rating-btn';
        b.textContent = val;
        b.onclick = function() {
          row.querySelectorAll('.rating-btn').forEach(function(x) {
            x.classList.remove('sel');
            x.style.background = '';
            x.style.borderColor = '';
            x.style.color = '';
          });
          this.classList.add('sel');
          this.style.background = g.accentDim;
          this.style.borderColor = g.accentBorder;
          this.style.color = g.accent;
          var hidden = document.getElementById(g.hiddenId);
          if (hidden) hidden.value = val;
        };
        row.appendChild(b);
      })(i);
    }
  });
}

function selectPill(el, exclusive, accent, accentDim, accentBorder) {
  var row = el.parentElement;
  if (exclusive) {
    row.querySelectorAll('.pill').forEach(function(p) {
      p.classList.remove('sel');
      p.style.background = '';
      p.style.borderColor = '';
      p.style.color = '';
    });
  }
  var isSelected = el.classList.contains('sel');
  if (!exclusive || !isSelected) {
    if (isSelected) {
      el.classList.remove('sel');
      el.style.background = '';
      el.style.borderColor = '';
      el.style.color = '';
    } else {
      el.classList.add('sel');
      el.style.background = accentDim;
      el.style.borderColor = accentBorder;
      el.style.color = accent;
    }
  }
  var hiddenId = row.dataset.hidden;
  if (hiddenId) {
    var selected = Array.from(row.querySelectorAll('.pill.sel')).map(function(p) { return p.dataset.val; }).join(', ');
    var hidden = document.getElementById(hiddenId);
    if (hidden) hidden.value = selected;
  }
}

async function submitFeedback(formEl, btnEl, errEl, successEl) {
  
  if (!window.APPS_SCRIPT_URL || window.APPS_SCRIPT_URL === 'PASTE_APPS_SCRIPT_URL_HERE') {
    errEl.textContent = 'Apps Script URL not set — open config.js and paste the deployment URL.';
    errEl.classList.add('show');
    return;
  }
  btnEl.classList.add('loading');
  btnEl.disabled = true;
  errEl.classList.remove('show');

  var data = {};
  formEl.querySelectorAll('[name]').forEach(function(el) {
    if (el.type === 'checkbox') return;
    if (el.value) data[el.name] = el.value;
  });
  var seen = {};
  formEl.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
    if (!seen[cb.name]) {
      seen[cb.name] = true;
      var vals = Array.from(formEl.querySelectorAll('input[name="' + cb.name + '"]:checked')).map(function(c) { return c.value; }).join('; ');
      if (vals) data[cb.name] = vals;
    }
  });

  try {
    await fetch(window.APPS_SCRIPT_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    btnEl.style.display = 'none';
    successEl.innerHTML = '<h3>Response recorded ✓</h3><p>Thanks for your feedback. <a href="../index.html">← Back to sessions</a></p>';
    successEl.classList.add('show');
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  } catch (err) {
    errEl.textContent = 'Network error: ' + err.message;
    errEl.classList.add('show');
    btnEl.classList.remove('loading');
    btnEl.disabled = false;
  }
}
