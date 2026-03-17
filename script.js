// ============================================================
//  ENGLISHPATH — MAIN APP LOGIC
// ============================================================

// ---- STATE ----
const STATE = {
  currentDay: 1,
  completed: {},  // { dayNum: { score, total, date } }
  streak: 0,
  totalScore: 0,
  lastCompletedDate: null,
  activeUnitFilter: 'all',
};

// ---- STORAGE ----
function saveState() {
  localStorage.setItem('ep_state', JSON.stringify({
    completed: STATE.completed,
    streak: STATE.streak,
    totalScore: STATE.totalScore,
    lastCompletedDate: STATE.lastCompletedDate,
    currentDay: STATE.currentDay,
  }));
}

function loadState() {
  const raw = localStorage.getItem('ep_state');
  if (!raw) return;
  const saved = JSON.parse(raw);
  Object.assign(STATE, saved);
}

// ---- ROUTING ----
function showView(id) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

// ---- CURRENT DAY (next uncompleted, or day since start) ----
function computeCurrentDay() {
  // Find first incomplete day starting from 1
  for (let d = 1; d <= 365; d++) {
    if (!STATE.completed[d]) return d;
  }
  return 365;
}

// ---- STREAK ----
function updateStreak() {
  const today = new Date().toDateString();
  const last = STATE.lastCompletedDate;
  if (!last) {
    STATE.streak = 1;
  } else if (last === today) {
    // already updated today
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (last === yesterday.toDateString()) {
      STATE.streak += 1;
    } else {
      STATE.streak = 1;
    }
  }
  STATE.lastCompletedDate = today;
}

// ---- DASHBOARD ----
function renderDashboard() {
  STATE.currentDay = computeCurrentDay();
  const lesson = ALL_LESSONS[STATE.currentDay];
  const completedCount = Object.keys(STATE.completed).length;

  // Header stats
  document.getElementById('dash-streak').textContent = STATE.streak;
  document.getElementById('dash-score').textContent = STATE.totalScore;

  // Today card
  document.getElementById('today-day-number').textContent = `Day ${STATE.currentDay}`;
  document.getElementById('today-lesson-title').textContent = lesson ? lesson.title : 'All done! 🎉';

  const typeMap = { new: 'New Material', review: 'Review', test: 'Test Day' };
  const typeColor = { new: '', review: 'review', test: 'test' };
  const dt = lesson ? lesson.dayType : 'new';
  document.getElementById('today-week-type').textContent = typeMap[dt] || 'New Material';
  document.getElementById('today-unit').textContent = lesson ? `Unit ${lesson.unit.num}` : '';

  const startBtn = document.getElementById('btn-start-today');
  if (STATE.completed[STATE.currentDay]) {
    startBtn.textContent = '✓ Completed — Review Again';
    startBtn.classList.add('done');
  } else {
    startBtn.textContent = 'Start Today\'s Lesson →';
    startBtn.classList.remove('done');
  }

  // Progress
  const pct = Math.round((completedCount / 365) * 100);
  document.getElementById('progress-fraction').textContent = `${completedCount} / 365 days`;
  document.getElementById('progress-bar-fill').style.width = pct + '%';

  // Week grid
  renderWeekGrid();

  // Lessons list
  renderLessonsList();
}

function renderWeekGrid() {
  const grid = document.getElementById('week-grid');
  grid.innerHTML = '';
  // Show the week of the current day
  const weekStart = Math.floor((STATE.currentDay - 1) / 7) * 7 + 1;
  const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  for (let i = 0; i < 7; i++) {
    const d = weekStart + i;
    if (d > 365) break;
    const lesson = ALL_LESSONS[d];
    const isCompleted = !!STATE.completed[d];
    const isToday = d === STATE.currentDay;
    const isLocked = d > STATE.currentDay && !isCompleted;

    const card = document.createElement('div');
    card.className = 'week-day-card' + (isCompleted ? ' completed' : '') + (isToday ? ' today' : '') + (isLocked ? ' locked' : '');
    card.innerHTML = `
      <div class="week-day-name">${dayNames[i]}</div>
      <div class="week-day-num">${d}</div>
      <div class="week-day-type">${lesson ? (lesson.dayType === 'review' ? '🔄' : lesson.dayType === 'test' ? '📋' : '📖') : ''}</div>
      ${isCompleted ? '<div class="week-check">✓</div>' : ''}
    `;
    if (!isLocked) {
      card.addEventListener('click', () => openLesson(d));
    }
    grid.appendChild(card);
  }
}

function renderLessonsList() {
  const filter = STATE.activeUnitFilter;

  // Unit filter buttons
  const filterEl = document.getElementById('unit-filter');
  filterEl.innerHTML = '';
  const allBtn = document.createElement('button');
  allBtn.className = 'unit-btn' + (filter === 'all' ? ' active' : '');
  allBtn.textContent = 'All';
  allBtn.onclick = () => { STATE.activeUnitFilter = 'all'; renderLessonsList(); };
  filterEl.appendChild(allBtn);

  UNITS.forEach(u => {
    const btn = document.createElement('button');
    btn.className = 'unit-btn' + (filter === String(u.num) ? ' active' : '');
    btn.textContent = `Unit ${u.num}`;
    btn.onclick = () => { STATE.activeUnitFilter = String(u.num); renderLessonsList(); };
    filterEl.appendChild(btn);
  });

  // Lessons
  const list = document.getElementById('lessons-list');
  list.innerHTML = '';

  for (let d = 1; d <= 365; d++) {
    const lesson = ALL_LESSONS[d];
    if (!lesson) continue;
    if (filter !== 'all' && String(lesson.unit.num) !== filter) continue;

    const isCompleted = !!STATE.completed[d];
    const isToday = d === STATE.currentDay;
    const isLocked = d > STATE.currentDay;

    const row = document.createElement('div');
    row.className = 'lesson-row' + (isCompleted ? ' completed' : '') + (isToday ? ' today-row' : '') + (isLocked ? ' locked' : '');
    row.innerHTML = `
      <div class="lesson-row-num">${d}</div>
      <div class="lesson-row-info">
        <div class="lesson-row-title">${lesson.title}</div>
        <div class="lesson-row-meta">Unit ${lesson.unit.num} · ${lesson.dayType === 'review' ? 'Review' : lesson.dayType === 'test' ? 'Test' : 'New Material'}${isCompleted && STATE.completed[d].score !== undefined ? ` · ⭐ ${STATE.completed[d].score}/${STATE.completed[d].total}` : ''}</div>
      </div>
      <div class="lesson-row-status">${isCompleted ? '✅' : isToday ? '▶️' : isLocked ? '🔒' : '○'}</div>
    `;
    if (!isLocked) {
      row.addEventListener('click', () => openLesson(d));
    }
    list.appendChild(row);
  }
}

// ---- OPEN LESSON ----
function openLesson(dayNum) {
  const lesson = ALL_LESSONS[dayNum];
  if (!lesson) return;

  // Header
  document.getElementById('lesson-header-day').textContent = `Day ${dayNum}`;
  document.getElementById('lesson-header-unit').textContent = `Unit ${lesson.unit.num}: ${lesson.unit.title}`;
  document.getElementById('lesson-header-score').textContent = `⭐ ${STATE.totalScore} pts`;

  // Title block
  const typeTagEl = document.getElementById('lesson-type-tag');
  typeTagEl.className = 'lesson-type-tag';
  if (lesson.dayType === 'review') { typeTagEl.textContent = 'REVIEW'; typeTagEl.classList.add('review'); }
  else if (lesson.dayType === 'test') { typeTagEl.textContent = 'TEST'; typeTagEl.classList.add('test'); }
  else { typeTagEl.textContent = 'NEW MATERIAL'; }

  document.getElementById('lesson-title').textContent = lesson.title;
  document.getElementById('lesson-subtitle').textContent = lesson.subtitle;

  // Render sections
  const contentEl = document.getElementById('lesson-content');
  contentEl.innerHTML = '';
  lesson.sections.forEach((section, idx) => {
    contentEl.appendChild(renderSection(section, idx));
  });

  // Complete button
  const completeBtn = document.getElementById('btn-complete-lesson');
  const summaryEl = document.getElementById('lesson-score-summary');
  summaryEl.style.display = 'none';

  if (STATE.completed[dayNum]) {
    completeBtn.textContent = '✓ Completed! (Do Again)';
    completeBtn.classList.add('done');
  } else {
    completeBtn.textContent = '✓ Complete Lesson';
    completeBtn.classList.remove('done');
  }

  completeBtn.onclick = () => completeLesson(dayNum, lesson);

  showView('view-lesson');
}

// ---- SECTION RENDERERS ----
function renderSection(section, idx) {
  const wrap = document.createElement('div');
  wrap.className = 'lesson-section';

  switch (section.type) {
    case 'explanation': wrap.innerHTML = renderExplanation(section); break;
    case 'table': wrap.innerHTML = renderTable(section); break;
    case 'examples': wrap.innerHTML = renderExamples(section); break;
    case 'exercise-fill': wrap.innerHTML = renderFill(section, idx); break;
    case 'exercise-choice': wrap.innerHTML = renderChoice(section, idx); break;
    case 'exercise-reorder': wrap.innerHTML = renderReorder(section, idx); break;
    case 'quiz': wrap.innerHTML = renderQuiz(section, idx); break;
    case 'fun-task': wrap.innerHTML = renderFunTask(section); break;
    default: wrap.innerHTML = `<p>${section.type}</p>`;
  }

  // Attach exercise logic AFTER inserting to DOM
  setTimeout(() => attachExerciseLogic(wrap, section, idx), 0);
  return wrap;
}

function renderExplanation(s) {
  return `
    <div class="lesson-section-title"><span class="section-icon"></span>${s.title}</div>
    ${s.rule ? `<div class="rule-box"><strong>RULE:</strong> ${s.rule}</div>` : ''}
    <div class="explanation-block">
      <div class="explanation-text">${s.content}</div>
      ${s.hungarian ? `<div class="hungarian-note">${s.hungarian}</div>` : ''}
    </div>
  `;
}

function renderTable(s) {
  const headers = s.headers.map(h => `<th>${h}</th>`).join('');
  const rows = s.rows.map(row =>
    `<tr>${row.map((cell, i) => `<td class="${i === s.accentCol ? 'acc' : ''}">${cell}</td>`).join('')}</tr>`
  ).join('');
  return `
    <div class="lesson-section-title">${s.title}</div>
    <div style="overflow-x:auto">
      <table class="structure-table">
        <thead><tr>${headers}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function renderExamples(s) {
  const items = s.items.map((item, i) => `
    <div class="example-item">
      <div class="example-num">${i + 1}.</div>
      <div>
        <div class="example-en">${item.en.replace(new RegExp(`\\b${escReg(item.focus)}\\b`, 'gi'), m => `<span class="highlight-word">${m}</span>`)}</div>
        ${item.hu ? `<div class="example-hu">${item.hu}</div>` : ''}
      </div>
    </div>
  `).join('');
  return `<div class="lesson-section-title">${s.title}</div><div class="examples-grid">${items}</div>`;
}

function escReg(str) {
  if (!str) return '';
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderFill(s, idx) {
  const items = s.items.map((item, i) => `
    <div class="exercise-item" data-fill-idx="${i}">
      <div class="exercise-prompt">${item.prompt.replace('___', `<input class="fill-input" data-answer="${escAttr(item.answer)}" data-hint="${escAttr(item.hint || '')}" placeholder="..." autocomplete="off" autocorrect="off" spellcheck="false" />`)}</div>
      <div class="feedback-text" data-fb="${i}"></div>
    </div>
  `).join('');
  return `
    <div class="lesson-section-title">${s.title}</div>
    ${s.instruction ? `<p style="font-size:0.88rem;color:var(--ink2);margin-bottom:12px">${s.instruction}</p>` : ''}
    ${items}
    <button class="btn-check" data-check-fill="${idx}">Check Answers</button>
  `;
}

function renderChoice(s, idx) {
  const items = s.items.map((item, i) => `
    <div class="exercise-item" data-choice-group="${idx}-${i}">
      <div class="exercise-prompt">${item.prompt}</div>
      <div class="choices-list">
        ${item.choices.map(c => `<button class="choice-btn" data-value="${escAttr(c)}" data-answer="${escAttr(item.answer)}">${c}</button>`).join('')}
      </div>
      <div class="feedback-text" data-fb-choice="${idx}-${i}"></div>
    </div>
  `).join('');
  return `
    <div class="lesson-section-title">${s.title}</div>
    ${items}
  `;
}

function renderReorder(s, idx) {
  const items = s.items.map((item, i) => `
    <div class="exercise-item" data-reorder-item="${idx}-${i}">
      <div class="exercise-prompt">Put the words in the correct order:</div>
      <div class="sentence-builder" data-builder="${idx}-${i}">
        <span class="sentence-placeholder">Click words to build the sentence →</span>
      </div>
      <div class="word-pool" data-pool="${idx}-${i}">
        ${shuffle([...item.words]).map(w => `<div class="word-chip" data-word="${escAttr(w)}">${w}</div>`).join('')}
      </div>
      <input type="hidden" data-reorder-answer="${idx}-${i}" value="${escAttr(item.answer)}" />
      <div class="feedback-text" data-fb-reorder="${idx}-${i}"></div>
    </div>
  `).join('');
  return `
    <div class="lesson-section-title">${s.title}</div>
    ${items}
    <button class="btn-check" data-check-reorder="${idx}">Check Answers</button>
  `;
}

function renderQuiz(s, idx) {
  const qs = s.questions.map((q, i) => `
    <div class="quiz-question" data-quiz-q="${idx}-${i}">
      <div class="quiz-q-num">QUESTION ${i + 1}</div>
      <div class="quiz-q-text">${q.q}</div>
      <div class="choices-list">
        ${q.choices.map(c => `<button class="choice-btn" data-value="${escAttr(c)}" data-answer="${escAttr(q.answer)}">${c}</button>`).join('')}
      </div>
      <div class="feedback-text" data-fb-quiz="${idx}-${i}"></div>
    </div>
  `).join('');
  return `<div class="lesson-section-title">${s.title}</div>${qs}`;
}

function renderFunTask(s) {
  return `
    <div class="fun-task-box">
      <div class="fun-task-emoji">${s.emoji}</div>
      <div class="fun-task-title">${s.title}</div>
      <div class="fun-task-desc">${s.desc.replace(/\n/g, '<br>')}</div>
      <textarea class="fun-task-textarea" placeholder="Write your answer here..."></textarea>
    </div>
  `;
}

// ---- EXERCISE LOGIC ----
function attachExerciseLogic(wrap, section, idx) {
  // Fill-in check buttons
  const checkFillBtn = wrap.querySelector(`[data-check-fill="${idx}"]`);
  if (checkFillBtn) {
    checkFillBtn.addEventListener('click', () => checkFill(wrap, idx));
  }

  // Choice buttons (immediate on click)
  wrap.querySelectorAll('.choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.dataset.answer;
      const value = btn.dataset.value;
      const parentQ = btn.closest('[data-quiz-q],[data-choice-group]');
      const allBtns = btn.closest('.choices-list').querySelectorAll('.choice-btn');

      // Already answered?
      if ([...allBtns].some(b => b.classList.contains('correct') || b.classList.contains('wrong'))) return;

      allBtns.forEach(b => b.disabled = true);

      if (value === answer) {
        btn.classList.add('correct');
        showFeedback(wrap, parentQ, true, null);
        awardPoints(5);
      } else {
        btn.classList.add('wrong');
        allBtns.forEach(b => { if (b.dataset.value === answer) b.classList.add('correct'); });
        showFeedback(wrap, parentQ, false, `Correct answer: <span class="correct-answer">${answer}</span>`);
      }
    });
  });

  // Reorder
  attachReorderLogic(wrap, idx);
  const checkReorderBtn = wrap.querySelector(`[data-check-reorder="${idx}"]`);
  if (checkReorderBtn) {
    checkReorderBtn.addEventListener('click', () => checkReorder(wrap, idx));
  }
}

function showFeedback(wrap, parentEl, correct, message) {
  if (!parentEl) return;
  const qAttr = parentEl.dataset.quizQ || parentEl.dataset.choiceGroup;
  if (!qAttr) return;

  let fb;
  const quizFb = parentEl.querySelector('[data-fb-quiz]');
  const choiceFb = parentEl.querySelector('[data-fb-choice]');
  fb = quizFb || choiceFb;

  if (fb) {
    fb.className = 'feedback-text show ' + (correct ? 'correct' : 'wrong');
    fb.innerHTML = correct ? '✓ Correct!' : `✗ Not quite. ${message || ''}`;
  }
}

function checkFill(wrap, idx) {
  const inputs = wrap.querySelectorAll('.fill-input');
  let correct = 0, total = inputs.length;

  inputs.forEach((input, i) => {
    const answer = input.dataset.answer;
    const hint = input.dataset.hint;
    const userVal = input.value.trim().toLowerCase();
    const correctVal = answer.toLowerCase();

    const fb = wrap.querySelector(`[data-fb="${i}"]`);
    input.disabled = true;

    if (userVal === correctVal) {
      input.classList.add('correct');
      if (fb) { fb.className = 'feedback-text show correct'; fb.textContent = '✓ Correct!'; }
      correct++;
      awardPoints(5);
    } else {
      input.classList.add('wrong');
      if (fb) {
        fb.className = 'feedback-text show wrong';
        fb.innerHTML = `✗ Answer: <span class="correct-answer">${answer}</span>${hint ? ` — ${hint}` : ''}`;
      }
    }
  });

  showToast(`${correct}/${total} correct!`);
}

function attachReorderLogic(wrap, idx) {
  const pools = wrap.querySelectorAll(`[data-pool]`);
  pools.forEach(pool => {
    const key = pool.dataset.pool;
    const builder = wrap.querySelector(`[data-builder="${key}"]`);

    pool.querySelectorAll('.word-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        if (chip.classList.contains('used')) return;
        chip.classList.add('used');

        const placed = document.createElement('div');
        placed.className = 'placed-word';
        placed.textContent = chip.dataset.word;
        placed.dataset.word = chip.dataset.word;

        // Remove placeholder
        const placeholder = builder.querySelector('.sentence-placeholder');
        if (placeholder) placeholder.remove();

        placed.addEventListener('click', () => {
          // Return word to pool
          placed.remove();
          chip.classList.remove('used');
          if (builder.children.length === 0) {
            builder.innerHTML = '<span class="sentence-placeholder">Click words to build the sentence →</span>';
          }
        });

        builder.appendChild(placed);
      });
    });
  });
}

function checkReorder(wrap, idx) {
  const items = wrap.querySelectorAll(`[data-reorder-item]`);
  items.forEach(item => {
    const key = item.dataset.reorderItem;
    const builder = wrap.querySelector(`[data-builder="${key}"]`);
    const answerInput = wrap.querySelector(`[data-reorder-answer="${key}"]`);
    const fb = wrap.querySelector(`[data-fb-reorder="${key}"]`);
    if (!builder || !answerInput || !fb) return;

    const placed = builder.querySelectorAll('.placed-word');
    const userSentence = [...placed].map(p => p.dataset.word).join(' ');
    const correct = answerInput.value;

    if (userSentence.toLowerCase() === correct.toLowerCase()) {
      fb.className = 'feedback-text show correct';
      fb.textContent = '✓ Correct!';
      awardPoints(10);
    } else {
      fb.className = 'feedback-text show wrong';
      fb.innerHTML = `✗ Correct order: <span class="correct-answer">${correct}</span>`;
    }
  });
}

// ---- COMPLETE LESSON ----
function completeLesson(dayNum, lesson) {
  updateStreak();

  const alreadyDone = !!STATE.completed[dayNum];

  if (!alreadyDone) {
    STATE.completed[dayNum] = {
      score: STATE.totalScore,
      date: new Date().toDateString(),
    };
    awardPoints(20); // completion bonus
    saveState();
  }

  const completedCount = Object.keys(STATE.completed).length;

  const summaryEl = document.getElementById('lesson-score-summary');
  const scoreBig = document.getElementById('score-big');
  const scoreDetail = document.getElementById('score-detail');

  summaryEl.style.display = 'block';

  if (alreadyDone) {
    scoreBig.textContent = '✓ Already Completed!';
    scoreDetail.textContent = 'Great for reviewing! Keep going.';
  } else {
    const messages = ['🌟 Excellent work!', '🎉 Lesson complete!', '💪 Great job!', '🔥 Fantastic!', '⭐ Well done!'];
    scoreBig.textContent = messages[dayNum % messages.length];
    scoreDetail.textContent = `Day ${dayNum} complete. Total score: ${STATE.totalScore} pts. Streak: ${STATE.streak} 🔥`;
  }

  const btn = document.getElementById('btn-complete-lesson');
  btn.textContent = '✓ Done! Back to Dashboard';
  btn.classList.add('done');
  btn.onclick = () => {
    showView('view-dashboard');
    renderDashboard();
  };

  showToast(alreadyDone ? 'Lesson reviewed! ✓' : `Day ${dayNum} complete! +20 pts 🎉`);
  summaryEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ---- POINTS ----
function awardPoints(pts) {
  STATE.totalScore += pts;
  const scoreEl = document.getElementById('lesson-header-score');
  if (scoreEl) scoreEl.textContent = `⭐ ${STATE.totalScore} pts`;
  saveState();
}

// ---- TOAST ----
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ---- UTILS ----
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escAttr(str) {
  if (!str) return '';
  return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ---- INIT ----
function init() {
  loadState();
  STATE.currentDay = computeCurrentDay();

  // Dashboard start button
  document.getElementById('btn-start-today').addEventListener('click', () => {
    openLesson(STATE.currentDay);
  });

  // Back button
  document.getElementById('btn-back').addEventListener('click', () => {
    showView('view-dashboard');
    renderDashboard();
  });

  renderDashboard();
  showView('view-dashboard');
}

document.addEventListener('DOMContentLoaded', init);
