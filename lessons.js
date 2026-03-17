// ============================================================
//  ENGLISHPATH — LESSONS DATA
//  First 7 days: fully written
//  Days 8–365: structured curriculum with scalable template
//  To add full content to any lesson: fill in the 'sections' array
// ============================================================

// ---- HELPERS ----
function makeLesson(day, unit, title, subtitle, dayType, sections) {
  return { day, unit, title, subtitle, dayType, sections };
}

// dayType: 'new' | 'review' | 'test'
// Section types: 'explanation' | 'examples' | 'table' | 'exercise-fill' | 'exercise-choice' | 'exercise-reorder' | 'quiz' | 'fun-task'

// ============================================================
//  CURRICULUM MAP (52 weeks / 365 days)
// ============================================================
//  UNIT 1 (Days 1–35)    — The Verb "To Be" + Pronouns
//  UNIT 2 (Days 36–70)   — Articles + Nouns + Basic Sentences
//  UNIT 3 (Days 71–105)  — Present Simple
//  UNIT 4 (Days 106–140) — Present Continuous
//  UNIT 5 (Days 141–175) — Past Simple
//  UNIT 6 (Days 176–210) — Future Forms
//  UNIT 7 (Days 211–245) — Questions & Negation (deep dive)
//  UNIT 8 (Days 246–280) — Adjectives & Comparison
//  UNIT 9 (Days 281–315) — Prepositions & Conjunctions
//  UNIT 10 (Days 316–350)— Modal Verbs
//  UNIT 11 (Days 351–365)— Review & Consolidation
// ============================================================

const UNITS = [
  { num: 1, title: 'The Verb "To Be" & Pronouns',    days: [1,35]   },
  { num: 2, title: 'Articles, Nouns & Basic Sentences', days: [36,70]  },
  { num: 3, title: 'Present Simple',                  days: [71,105]  },
  { num: 4, title: 'Present Continuous',              days: [106,140] },
  { num: 5, title: 'Past Simple',                     days: [141,175] },
  { num: 6, title: 'Future Forms',                    days: [176,210] },
  { num: 7, title: 'Questions & Negation',            days: [211,245] },
  { num: 8, title: 'Adjectives & Comparison',         days: [246,280] },
  { num: 9, title: 'Prepositions & Conjunctions',     days: [281,315] },
  { num:10, title: 'Modal Verbs',                     days: [316,350] },
  { num:11, title: 'Review & Consolidation',          days: [351,365] },
];

function getUnit(day) {
  for (const u of UNITS) {
    if (day >= u.days[0] && day <= u.days[1]) return u;
  }
  return UNITS[UNITS.length-1];
}

function getDayType(day) {
  const dow = ((day - 1) % 7); // 0=Mon,1=Tue,...,5=Sat,6=Sun
  if (dow === 5) return 'review';
  if (dow === 6) return 'test';
  return 'new';
}

// ============================================================
//  FULLY WRITTEN LESSONS — DAYS 1–7
// ============================================================

const FULL_LESSONS = {

// ------ DAY 1 ------
1: {
  title: 'Hello! I am, You are, He is…',
  subtitle: 'Your very first English grammar lesson. We start with the most important verb: TO BE.',
  sections: [
    {
      type: 'explanation',
      title: '📖 What is "To Be"?',
      content: `In English, the verb <strong>"to be"</strong> changes depending on who we talk about. This is similar to Hungarian — in Hungarian you say "vagyok", "vagy", "van" — in English we say "am", "are", "is".`,
      hungarian: 'A "to be" ige magyarul: van, vagyok, vagy, stb. Ez az angol legeslegfontosabb igéje!',
      rule: 'I <strong>am</strong> &nbsp;|&nbsp; You <strong>are</strong> &nbsp;|&nbsp; He / She / It <strong>is</strong> &nbsp;|&nbsp; We / You / They <strong>are</strong>',
    },
    {
      type: 'table',
      title: '📊 The Full Table',
      headers: ['Pronoun', 'Full form', 'Short form', 'Hungarian'],
      rows: [
        ['I',      'I am',    "I'm",    'én vagyok'],
        ['You',    'You are', "You're", 'te vagy'],
        ['He',     'He is',   "He's",   'ő van (férfi)'],
        ['She',    'She is',  "She's",  'ő van (nő)'],
        ['It',     'It is',   "It's",   'az van (tárgy/állat)'],
        ['We',     'We are',  "We're",  'mi vagyunk'],
        ['You',    'You are', "You're", 'ti vagytok'],
        ['They',   'They are',"They're",'ők vannak'],
      ],
      accentCol: 1,
    },
    {
      type: 'examples',
      title: '💬 Examples — Look & Remember',
      items: [
        { en: "I am happy.", hu: 'Boldog vagyok.', focus: 'am' },
        { en: "You are my friend.", hu: 'Te vagy a barátom.', focus: 'are' },
        { en: "He is a student.", hu: 'Ő diák.', focus: 'is' },
        { en: "She is tall.", hu: 'Ő magas.', focus: 'is' },
        { en: "It is a cat.", hu: 'Az egy macska.', focus: 'is' },
        { en: "We are tired.", hu: 'Fáradtak vagyunk.', focus: 'are' },
        { en: "They are from Hungary.", hu: 'Ők Magyarországról valók.', focus: 'are' },
        { en: "I'm 13 years old.", hu: '13 éves vagyok.', focus: "I'm" },
      ],
    },
    {
      type: 'exercise-fill',
      title: '✏️ Exercise 1 — Fill in the blank',
      instruction: 'Write the correct form of "to be" (am / is / are):',
      items: [
        { prompt: 'I ___ a student.', answer: 'am', hint: 'I → am' },
        { prompt: 'She ___ kind.', answer: 'is', hint: 'She → is' },
        { prompt: 'They ___ at school.', answer: 'are', hint: 'They → are' },
        { prompt: 'He ___ my brother.', answer: 'is', hint: 'He → is' },
        { prompt: 'We ___ happy today.', answer: 'are', hint: 'We → are' },
        { prompt: 'You ___ great!', answer: 'are', hint: 'You → are' },
      ],
    },
    {
      type: 'exercise-choice',
      title: '🧠 Exercise 2 — Choose the correct answer',
      items: [
        { prompt: 'My dog ___ small.', choices: ['am','is','are'], answer: 'is' },
        { prompt: 'My parents ___ at home.', choices: ['am','is','are'], answer: 'are' },
        { prompt: 'I ___ from Hungary.', choices: ['am','is','are'], answer: 'am' },
        { prompt: 'The book ___ on the table.', choices: ['am','is','are'], answer: 'is' },
      ],
    },
    {
      type: 'quiz',
      title: '🎯 Mini Quiz',
      questions: [
        {
          q: 'Which is correct?',
          choices: ['He am tall.', 'He is tall.', 'He are tall.'],
          answer: 'He is tall.',
        },
        {
          q: 'Which is correct?',
          choices: ['We is friends.', 'We am friends.', 'We are friends.'],
          answer: 'We are friends.',
        },
        {
          q: 'What does "She\'s" mean?',
          choices: ['She is', 'She was', 'She are'],
          answer: 'She is',
        },
        {
          q: 'Complete: "I ___ hungry."',
          choices: ['is', 'are', 'am'],
          answer: 'am',
        },
      ],
    },
    {
      type: 'fun-task',
      emoji: '📝',
      title: 'Your Turn!',
      desc: 'Write 3 sentences about yourself using "am", "is", or "are". For example: "I am 13 years old. My name is ___. My room is big."',
    },
  ],
},

// ------ DAY 2 ------
2: {
  title: 'Negative "To Be" — I am NOT!',
  subtitle: 'Today we learn how to say something is NOT true. Negation with "to be".',
  sections: [
    {
      type: 'explanation',
      title: '📖 How to say NOT',
      content: `To make a negative sentence with "to be", simply add <strong>not</strong> after the verb.<br><br>
      I am → I am <strong>not</strong> / I'm <strong>not</strong><br>
      He is → He is <strong>not</strong> / He <strong>isn't</strong><br>
      They are → They are <strong>not</strong> / They <strong>aren't</strong>`,
      hungarian: 'Tagadáshoz csak tegyél "not"-ot a to be ige után. Magyarul: "nem vagyok", "nem vagy", "nem van" stb.',
      rule: 'am <strong>not</strong> &nbsp;|&nbsp; is <strong>not</strong> = <strong>isn\'t</strong> &nbsp;|&nbsp; are <strong>not</strong> = <strong>aren\'t</strong>',
    },
    {
      type: 'table',
      title: '📊 Negative Forms',
      headers: ['Positive', 'Negative (full)', 'Negative (short)'],
      rows: [
        ['I am',    'I am not',     "I'm not"],
        ['You are', 'You are not',  "You aren't"],
        ['He is',   'He is not',    "He isn't"],
        ['She is',  'She is not',   "She isn't"],
        ['It is',   'It is not',    "It isn't"],
        ['We are',  'We are not',   "We aren't"],
        ['They are','They are not', "They aren't"],
      ],
      accentCol: 2,
    },
    {
      type: 'examples',
      title: '💬 Examples',
      items: [
        { en: "I'm not a doctor.", hu: 'Nem vagyok orvos.', focus: "not" },
        { en: "He isn't at home.", hu: 'Nincs otthon.', focus: "isn't" },
        { en: "She isn't happy.", hu: 'Nem boldog.', focus: "isn't" },
        { en: "They aren't tired.", hu: 'Nem fáradtak.', focus: "aren't" },
        { en: "It isn't cold today.", hu: 'Ma nem hideg.', focus: "isn't" },
        { en: "We aren't late.", hu: 'Nem vagyunk késők.', focus: "aren't" },
        { en: "You aren't wrong.", hu: 'Nem tévedsz.', focus: "aren't" },
      ],
    },
    {
      type: 'exercise-fill',
      title: '✏️ Exercise 1 — Make it negative (use short forms)',
      instruction: "Write the negative short form (isn't / aren't / I'm not):",
      items: [
        { prompt: 'She is a teacher. → She ___ a teacher.', answer: "isn't", hint: "She isn't" },
        { prompt: 'They are late. → They ___ late.', answer: "aren't", hint: "They aren't" },
        { prompt: 'I am tired. → I ___ tired.', answer: "I'm not", hint: "I'm not" },
        { prompt: 'He is hungry. → He ___ hungry.', answer: "isn't", hint: "He isn't" },
        { prompt: 'We are ready. → We ___ ready.', answer: "aren't", hint: "We aren't" },
      ],
    },
    {
      type: 'exercise-choice',
      title: '🧠 Exercise 2 — Choose the correct negative',
      items: [
        {
          prompt: 'The dog ___ big. It is small.',
          choices: ["isn't", "aren't", "am not"],
          answer: "isn't",
        },
        {
          prompt: 'I ___ from England. I\'m from Hungary.',
          choices: ["isn't", "aren't", "I'm not"],
          answer: "I'm not",
        },
        {
          prompt: 'My friends ___ at school today.',
          choices: ["isn't", "aren't", "am not"],
          answer: "aren't",
        },
      ],
    },
    {
      type: 'exercise-reorder',
      title: '🔀 Exercise 3 — Put the words in order',
      items: [
        { words: ['not', 'I', 'am', 'wrong'], answer: 'I am not wrong' },
        { words: ['isn\'t', 'He', 'student', 'a'], answer: "He isn't a student" },
        { words: ['cold', 'today', 'It', 'isn\'t'], answer: "It isn't cold today" },
      ],
    },
    {
      type: 'quiz',
      title: '🎯 Mini Quiz',
      questions: [
        {
          q: 'Which is correct?',
          choices: ["I isn't tired.", "I aren't tired.", "I'm not tired."],
          answer: "I'm not tired.",
        },
        {
          q: 'Make negative: "She is a nurse."',
          choices: ["She isn't a nurse.", "She aren't a nurse.", "She am not a nurse."],
          answer: "She isn't a nurse.",
        },
        {
          q: 'Which short form is correct?',
          choices: ["They isn't here.", "They aren't here.", "They am not here."],
          answer: "They aren't here.",
        },
      ],
    },
    {
      type: 'fun-task',
      emoji: '🚀',
      title: 'Challenge!',
      desc: 'Write 3 sentences about things that are NOT true about you. Example: "I\'m not a robot. I\'m not from England. My hair isn\'t red."',
    },
  ],
},

// ------ DAY 3 ------
3: {
  title: 'Questions with "To Be"',
  subtitle: 'How to ask questions — "Are you…?", "Is he…?", "Am I…?"',
  sections: [
    {
      type: 'explanation',
      title: '📖 How to ask a question',
      content: `In English, to make a question with "to be", you <strong>swap</strong> the subject and the verb.<br><br>
      Statement: <em>You are happy.</em><br>
      Question: <em><strong>Are</strong> you happy?</em><br><br>
      Statement: <em>He is a student.</em><br>
      Question: <em><strong>Is</strong> he a student?</em>`,
      hungarian: 'Kérdésnél felcseréled az alanyt és az igét. Angolban a kérdőszó a mondat elejére kerül!',
      rule: 'Statement: Subject + Verb &nbsp;→&nbsp; Question: <strong>Verb + Subject?</strong>',
    },
    {
      type: 'table',
      title: '📊 Question Forms',
      headers: ['Statement', 'Question', 'Short answer YES', 'Short answer NO'],
      rows: [
        ['I am ready.', 'Am I ready?', 'Yes, you are.', "No, you aren't."],
        ['You are kind.', 'Are you kind?', 'Yes, I am.', "No, I'm not."],
        ['He is tall.', 'Is he tall?', 'Yes, he is.', "No, he isn't."],
        ['She is at home.', 'Is she at home?', 'Yes, she is.', "No, she isn't."],
        ['We are late.', 'Are we late?', 'Yes, we are.', "No, we aren't."],
        ['They are friends.', 'Are they friends?', 'Yes, they are.', "No, they aren't."],
      ],
      accentCol: 1,
    },
    {
      type: 'examples',
      title: '💬 Examples',
      items: [
        { en: "Are you hungry?", hu: 'Éhes vagy?', focus: 'Are' },
        { en: "Is she a teacher?", hu: 'Ő tanár?', focus: 'Is' },
        { en: "Is it cold outside?", hu: 'Hideg van kint?', focus: 'Is' },
        { en: "Are they from Hungary?", hu: 'Ők Magyarországról valók?', focus: 'Are' },
        { en: "Is he at school?", hu: 'Ő iskolában van?', focus: 'Is' },
        { en: "Are we late?", hu: 'Késők vagyunk?', focus: 'Are' },
        { en: "— Are you tired? — Yes, I am.", hu: '— Fáradt vagy? — Igen, az vagyok.', focus: 'Are / am' },
        { en: "— Is he tall? — No, he isn't.", hu: '— Magas ő? — Nem, nem magas.', focus: "Is / isn't" },
      ],
    },
    {
      type: 'exercise-fill',
      title: '✏️ Exercise 1 — Write the question',
      instruction: 'Turn each statement into a question:',
      items: [
        { prompt: 'He is a doctor. → ___ he a doctor?', answer: 'Is', hint: 'He is → Is he' },
        { prompt: 'They are ready. → ___ they ready?', answer: 'Are', hint: 'They are → Are they' },
        { prompt: 'She is from France. → ___ she from France?', answer: 'Is', hint: 'She is → Is she' },
        { prompt: 'You are my friend. → ___ you my friend?', answer: 'Are', hint: 'You are → Are you' },
        { prompt: 'It is a good film. → ___ it a good film?', answer: 'Is', hint: 'It is → Is it' },
      ],
    },
    {
      type: 'exercise-choice',
      title: '🧠 Exercise 2 — Short answers',
      items: [
        {
          prompt: 'Are you 13 years old? (Yes)',
          choices: ['Yes, I am.', 'Yes, I is.', 'Yes, I are.'],
          answer: 'Yes, I am.',
        },
        {
          prompt: 'Is she happy? (No)',
          choices: ["No, she am not.", "No, she isn't.", "No, she aren't."],
          answer: "No, she isn't.",
        },
        {
          prompt: 'Are they at home? (Yes)',
          choices: ['Yes, they is.', 'Yes, they am.', 'Yes, they are.'],
          answer: 'Yes, they are.',
        },
      ],
    },
    {
      type: 'quiz',
      title: '🎯 Mini Quiz',
      questions: [
        {
          q: 'Which question is correct?',
          choices: ['He is tired?', 'Is he tired?', 'Is tired he?'],
          answer: 'Is he tired?',
        },
        {
          q: 'Which question is correct?',
          choices: ['Are you student?', 'Are you a student?', 'You are a student?'],
          answer: 'Are you a student?',
        },
        {
          q: 'Someone asks: "Are you from Hungary?" You say YES. What do you answer?',
          choices: ['Yes, I is.', 'Yes, I am.', 'Yes, am I.'],
          answer: 'Yes, I am.',
        },
        {
          q: 'Someone asks: "Is she your sister?" You say NO. What do you answer?',
          choices: ["No, she isn't.", "No, she aren't.", "No, she am not."],
          answer: "No, she isn't.",
        },
      ],
    },
    {
      type: 'fun-task',
      emoji: '❓',
      title: 'Interview a Friend (or Imagine One!)',
      desc: 'Write 4 questions you would ask a new friend. Use "Are you…?" or "Is your…?"\nExample: "Are you from Hungary? Is your school big? Are you funny? Is your favourite colour blue?"',
    },
  ],
},

// ------ DAY 4 ------
4: {
  title: 'Personal Pronouns',
  subtitle: 'I, you, he, she, it, we, they — and when to use each one.',
  sections: [
    {
      type: 'explanation',
      title: '📖 What is a pronoun?',
      content: `A pronoun replaces a noun. Instead of saying "Peter is tall" every time, we say <strong>"He is tall"</strong>. 
      Pronouns save time and make speaking easier!<br><br>
      In English, pronouns <strong>always come before the verb</strong>. This is different from Hungarian, where you often skip the pronoun.`,
      hungarian: 'A névmás helyettesíti a főnevet. Angolban MINDIG ki kell írni! (én, te, ő, mi, ti, ők)',
      rule: 'ALWAYS use a pronoun before the verb in English. You cannot skip it!',
    },
    {
      type: 'table',
      title: '📊 Subject Pronouns',
      headers: ['English', 'When to use', 'Example', 'Hungarian'],
      rows: [
        ['I',    'when you talk about yourself', 'I am a student.', 'én'],
        ['You',  'one person you talk TO', 'You are funny.', 'te'],
        ['He',   'one male person', 'He is my brother.', 'ő (férfi)'],
        ['She',  'one female person', 'She is tall.', 'ő (nő)'],
        ['It',   'one thing, animal, or idea', 'It is a big house.', 'az/ő (tárgy/állat)'],
        ['We',   'me + others', 'We are at school.', 'mi'],
        ['You',  'a group you talk TO', 'You are all great!', 'ti'],
        ['They', 'other people or things', 'They are my friends.', 'ők'],
      ],
      accentCol: 0,
    },
    {
      type: 'examples',
      title: '💬 Examples — Replace the noun with a pronoun',
      items: [
        { en: "Peter is tall. → He is tall.", hu: 'Péter magas. → Ő magas.', focus: 'He' },
        { en: "Anna is smart. → She is smart.", hu: 'Anna okos. → Ő okos.', focus: 'She' },
        { en: "My cat is black. → It is black.", hu: 'A macskám fekete. → Az fekete.', focus: 'It' },
        { en: "The film is good. → It is good.", hu: 'A film jó. → Az jó.', focus: 'It' },
        { en: "Tom and I are friends. → We are friends.", hu: 'Tom és én barátok vagyunk. → Mi barátok vagyunk.', focus: 'We' },
        { en: "My parents are at home. → They are at home.", hu: 'Szüleim otthon vannak. → Ők otthon vannak.', focus: 'They' },
      ],
    },
    {
      type: 'exercise-fill',
      title: '✏️ Exercise — Replace the underlined word with a pronoun',
      instruction: 'Write the correct pronoun (he / she / it / they / we):',
      items: [
        { prompt: 'My mum is kind. ___ is kind.', answer: 'She', hint: 'mum = she' },
        { prompt: 'My dog is funny. ___ is funny.', answer: 'It', hint: 'dog = it' },
        { prompt: 'Tom and Peter are brothers. ___ are brothers.', answer: 'They', hint: 'Tom and Peter = they' },
        { prompt: 'My dad is tired. ___ is tired.', answer: 'He', hint: 'dad = he' },
        { prompt: 'Anna and I are at school. ___ are at school.', answer: 'We', hint: 'Anna and I = we' },
        { prompt: 'The car is fast. ___ is fast.', answer: 'It', hint: 'car = it' },
      ],
    },
    {
      type: 'exercise-choice',
      title: '🧠 Exercise 2 — Which pronoun?',
      items: [
        {
          prompt: 'Your friend (male) is happy. What do you say?',
          choices: ['She is happy.', 'He is happy.', 'It is happy.'],
          answer: 'He is happy.',
        },
        {
          prompt: 'Your book is on the table. What do you say?',
          choices: ['She is on the table.', 'He is on the table.', 'It is on the table.'],
          answer: 'It is on the table.',
        },
        {
          prompt: 'You and your sister are at home. What do you say?',
          choices: ['They are at home.', 'We are at home.', 'You are at home.'],
          answer: 'We are at home.',
        },
      ],
    },
    {
      type: 'quiz',
      title: '🎯 Mini Quiz',
      questions: [
        {
          q: 'Which pronoun replaces "my sister"?',
          choices: ['He', 'She', 'It'],
          answer: 'She',
        },
        {
          q: 'Which sentence is correct?',
          choices: ['Is cold today.', 'It is cold today.', 'Cold is today.'],
          answer: 'It is cold today.',
        },
        {
          q: 'You are talking to two friends. Which pronoun do you use?',
          choices: ['I', 'We', 'You'],
          answer: 'You',
        },
        {
          q: '"Peter and Anna are students." Replace with pronouns:',
          choices: ['We are students.', 'They are students.', 'You are students.'],
          answer: 'They are students.',
        },
      ],
    },
    {
      type: 'fun-task',
      emoji: '👨‍👩‍👧‍👦',
      title: 'My World!',
      desc: 'Write 5 sentences about people or things around you. Use he, she, it, we, or they.\nExample: "My mum is at work. She is a teacher. My dog is small. It is funny. My friends are cool. They are funny."',
    },
  ],
},

// ------ DAY 5 ------
5: {
  title: '"To Be" with Age, Jobs & Places',
  subtitle: 'Using "to be" in real life — talking about age, professions, and where things are.',
  sections: [
    {
      type: 'explanation',
      title: '📖 Three uses of "To Be"',
      content: `In English, "to be" has many uses. Today we practise three of the most common:<br><br>
      1. <strong>Age:</strong> I am 13 years old.<br>
      2. <strong>Jobs:</strong> She is a doctor.<br>
      3. <strong>Location:</strong> We are at school.<br><br>
      Notice: for jobs, we always use <strong>a/an</strong> before the noun. (We will study a/an more in Unit 2!)`,
      hungarian: 'Korhoz, foglalkozáshoz és helyhez is a "to be" igét használjuk. Ezt magyarul a "van" igével fejezzük ki (vagy éppen kihagyjuk!)',
    },
    {
      type: 'examples',
      title: '💬 Age',
      items: [
        { en: "I am 13 years old.", hu: '13 éves vagyok.', focus: 'am' },
        { en: "She is 25 years old.", hu: '25 éves.', focus: 'is' },
        { en: "My cat is 3 years old.", hu: 'A macskám 3 éves.', focus: 'is' },
        { en: "We are the same age.", hu: 'Egyidősek vagyunk.', focus: 'are' },
      ],
    },
    {
      type: 'examples',
      title: '💬 Jobs',
      items: [
        { en: "My dad is a farmer.", hu: 'Az apám gazda.', focus: 'is a' },
        { en: "She is a doctor.", hu: 'Ő orvos.', focus: 'is a' },
        { en: "They are teachers.", hu: 'Ők tanárok.', focus: 'are' },
        { en: "I want to be an engineer.", hu: 'Mérnök akarok lenni.', focus: 'be an' },
      ],
    },
    {
      type: 'examples',
      title: '💬 Places',
      items: [
        { en: "We are at school.", hu: 'Iskolában vagyunk.', focus: 'are at' },
        { en: "She is in her room.", hu: 'A szobájában van.', focus: 'is in' },
        { en: "The keys are on the table.", hu: 'A kulcsok az asztalon vannak.', focus: 'are on' },
        { en: "He is at work.", hu: 'Munkában van.', focus: 'is at' },
      ],
    },
    {
      type: 'exercise-fill',
      title: '✏️ Exercise 1 — Fill in "am", "is", or "are"',
      instruction: '',
      items: [
        { prompt: 'My teacher ___ from England.', answer: 'is', hint: 'teacher = he/she → is' },
        { prompt: 'I ___ 13 years old.', answer: 'am', hint: 'I → am' },
        { prompt: 'They ___ doctors.', answer: 'are', hint: 'They → are' },
        { prompt: 'My phone ___ in my bag.', answer: 'is', hint: 'phone = it → is' },
        { prompt: 'We ___ at home today.', answer: 'are', hint: 'We → are' },
        { prompt: 'She ___ a great singer.', answer: 'is', hint: 'She → is' },
      ],
    },
    {
      type: 'exercise-choice',
      title: '🧠 Exercise 2 — Complete the sentences',
      items: [
        {
          prompt: 'My brother ___ 16 years old.',
          choices: ['am', 'is', 'are'],
          answer: 'is',
        },
        {
          prompt: 'We ___ at the cinema.',
          choices: ['am', 'is', 'are'],
          answer: 'are',
        },
        {
          prompt: 'She ___ a nurse.',
          choices: ['am', 'is', 'are'],
          answer: 'is',
        },
      ],
    },
    {
      type: 'quiz',
      title: '🎯 Mini Quiz',
      questions: [
        {
          q: 'I ___ 13 years old.',
          choices: ['am', 'is', 'are'],
          answer: 'am',
        },
        {
          q: 'My parents ___ teachers.',
          choices: ['am', 'is', 'are'],
          answer: 'are',
        },
        {
          q: 'The library ___ next to the school.',
          choices: ['am', 'is', 'are'],
          answer: 'is',
        },
        {
          q: 'Which is correct for jobs?',
          choices: ['She is doctor.', 'She is a doctor.', 'She is the doctor all people.'],
          answer: 'She is a doctor.',
        },
      ],
    },
    {
      type: 'fun-task',
      emoji: '🌍',
      title: 'About You & Your World',
      desc: 'Write 5 sentences. Include:\n1. Your age\n2. Something about your school\n3. One thing about where something is ("My phone is...")\n4. What someone in your family does for work\n5. Where you are right now',
    },
  ],
},

// ------ DAY 6 — SATURDAY REVIEW ------
6: {
  title: 'Week 1 Review — To Be',
  subtitle: 'Let\'s go back over everything from this week. Light and fun practice!',
  sections: [
    {
      type: 'explanation',
      title: '📖 What We Learned This Week',
      content: `This week we covered the verb <strong>"to be"</strong> — the most important verb in English!<br><br>
      ✅ Positive: I am, You are, He/She/It is, We/They are<br>
      ✅ Negative: I'm not, He isn't, They aren't<br>
      ✅ Questions: Am I? Is he? Are they?<br>
      ✅ Short answers: Yes, I am. / No, she isn't.<br>
      ✅ Pronouns: I, you, he, she, it, we, they<br>
      ✅ Uses: age, jobs, location`,
      hungarian: 'A héten a "to be" igét tanultuk: állítás, tagadás, kérdés és rövid válasz formáit.',
    },
    {
      type: 'exercise-fill',
      title: '✏️ Mixed Fill-in — Show What You Know',
      instruction: 'Complete with am / is / are / isn\'t / aren\'t:',
      items: [
        { prompt: 'I ___ from Hungary.', answer: 'am', hint: 'I → am' },
        { prompt: 'My sister ___ 10 years old.', answer: 'is', hint: 'sister → is' },
        { prompt: 'They ___ at school today.', answer: 'are', hint: 'they → are' },
        { prompt: 'He ___ a student. He is a teacher.', answer: "isn't", hint: "He isn't" },
        { prompt: 'We ___ happy today!', answer: 'are', hint: 'we → are' },
        { prompt: 'It ___ cold outside. It\'s warm.', answer: "isn't", hint: "It isn't" },
      ],
    },
    {
      type: 'exercise-choice',
      title: '🧠 Write the correct question',
      items: [
        {
          prompt: 'Your friend seems sad. How do you ask?',
          choices: ['You are sad?', 'Are you sad?', 'Is you sad?'],
          answer: 'Are you sad?',
        },
        {
          prompt: 'You want to know if the shop is open. What do you ask?',
          choices: ['The shop is open?', 'Is the shop open?', 'Are the shop open?'],
          answer: 'Is the shop open?',
        },
        {
          prompt: 'You want to know if your friends are ready. What do you ask?',
          choices: ['Ready your friends are?', 'Are your friends ready?', 'Is your friends ready?'],
          answer: 'Are your friends ready?',
        },
      ],
    },
    {
      type: 'exercise-reorder',
      title: '🔀 Reorder the Sentences',
      items: [
        { words: ['from', 'I', 'Hungary', 'am'], answer: 'I am from Hungary' },
        { words: ['isn\'t', 'a', 'She', 'student'], answer: "She isn't a student" },
        { words: ['Are', 'at', 'they', 'home', '?'], answer: 'Are they at home ?' },
        { words: ['am', 'years', 'I', '13', 'old'], answer: 'I am 13 years old' },
      ],
    },
    {
      type: 'quiz',
      title: '🎯 Week 1 Quiz',
      questions: [
        {
          q: 'Which sentence is correct?',
          choices: ['I is happy.', 'I am happy.', 'I are happy.'],
          answer: 'I am happy.',
        },
        {
          q: 'Make this negative: "She is at home."',
          choices: ["She isn't at home.", "She aren't at home.", "She am not at home."],
          answer: "She isn't at home.",
        },
        {
          q: 'How do you turn this into a question: "They are ready."',
          choices: ['They ready are?', 'Are they ready?', 'Is they ready?'],
          answer: 'Are they ready?',
        },
        {
          q: '"My cat is black." What pronoun replaces "my cat"?',
          choices: ['He', 'She', 'It'],
          answer: 'It',
        },
        {
          q: '"Are you tired?" — You ARE tired. What do you answer?',
          choices: ['Yes, I is.', 'Yes, I am.', 'Yes, am I.'],
          answer: 'Yes, I am.',
        },
      ],
    },
    {
      type: 'fun-task',
      emoji: '✍️',
      title: 'Freewriting — Your Week',
      desc: 'Write a short paragraph (4–6 sentences) about your week. Use "to be" as much as you can!\nExample: "I am tired. This week is busy. My friends are funny. School is interesting..."',
    },
  ],
},

// ------ DAY 7 — SUNDAY TEST ------
7: {
  title: 'Week 1 Test — "To Be"',
  subtitle: 'Time to show what you know! Answer all questions carefully.',
  sections: [
    {
      type: 'explanation',
      title: '📋 Test Instructions',
      content: `This is your <strong>Week 1 Test</strong>. It covers everything from Days 1–6.<br><br>
      Take your time. Read each question carefully. You can do this! 💪<br><br>
      After you check your answers, you'll see your score for this lesson.`,
      hungarian: 'Ez az első heti tesztünk. Olvass el mindent figyelmesen és próbáld meg a legjobban!',
    },
    {
      type: 'exercise-fill',
      title: '📝 Part 1 — Fill in the blank (am / is / are / isn\'t / aren\'t)',
      instruction: '',
      items: [
        { prompt: '1. My name ___ Alex.', answer: 'is', hint: 'name → is' },
        { prompt: '2. I ___ a good student.', answer: 'am', hint: 'I → am' },
        { prompt: '3. They ___ at the park.', answer: 'are', hint: 'They → are' },
        { prompt: '4. She ___ tired. She is energetic.', answer: "isn't", hint: "isn't" },
        { prompt: '5. My friends ___ from England. They are from Hungary.', answer: "aren't", hint: "aren't" },
        { prompt: '6. The film ___ long. It is 3 hours!', answer: 'is', hint: 'film → is' },
        { prompt: '7. We ___ in class right now.', answer: 'are', hint: 'We → are' },
        { prompt: '8. It ___ a good day.', answer: 'is', hint: 'It → is' },
      ],
    },
    {
      type: 'exercise-choice',
      title: '📝 Part 2 — Choose the Correct Answer',
      items: [
        {
          prompt: '9. Turn into a question: "She is a doctor."',
          choices: ['She is a doctor?', 'Is she a doctor?', 'Is a doctor she?'],
          answer: 'Is she a doctor?',
        },
        {
          prompt: '10. Your answer to "Are you Hungarian?" (YES)',
          choices: ['Yes, I is.', 'Yes, am I.', 'Yes, I am.'],
          answer: 'Yes, I am.',
        },
        {
          prompt: '11. Your answer to "Is it cold?" (NO)',
          choices: ["No, it isn't.", "No, it aren't.", "No, it am not."],
          answer: "No, it isn't.",
        },
        {
          prompt: '12. "My parents are doctors." Replace with a pronoun:',
          choices: ['He is a doctor.', 'They are doctors.', 'We are doctors.'],
          answer: 'They are doctors.',
        },
      ],
    },
    {
      type: 'exercise-reorder',
      title: '📝 Part 3 — Put Words in Order',
      items: [
        { words: ['is', 'old', 'My', '13', 'brother', 'years'], answer: 'My brother is 13 years old' },
        { words: ['they', 'Are', 'at', 'home', '?'], answer: 'Are they at home ?' },
        { words: ['am', 'not', 'I', 'late'], answer: 'I am not late' },
        { words: ['a', 'teacher', 'is', 'She'], answer: 'She is a teacher' },
      ],
    },
    {
      type: 'quiz',
      title: '📝 Part 4 — Final Questions',
      questions: [
        {
          q: '13. Which form is correct for "not" with "I am"?',
          choices: ["I isn't", "I'm not", "I aren't"],
          answer: "I'm not",
        },
        {
          q: '14. Which pronoun do you use for a male friend?',
          choices: ['It', 'She', 'He'],
          answer: 'He',
        },
        {
          q: '15. Which sentence talks about a job correctly?',
          choices: ['He is doctor.', 'He is a doctor.', 'He is the doctor work.'],
          answer: 'He is a doctor.',
        },
      ],
    },
    {
      type: 'fun-task',
      emoji: '🏆',
      title: 'Bonus — About a Person You Admire',
      desc: 'Write 4 sentences about someone you admire (a sports player, a family member, anyone). Use "is", "isn\'t" and make one question about them.\nExample: "He is a great football player. He is 25 years old. He isn\'t from Hungary. Is he the best player?"',
    },
  ],
},

}; // end FULL_LESSONS

// ============================================================
//  LESSON TITLE + STRUCTURE for days 8–365
//  (Fully playable with generated exercises; 
//   replace with full content anytime)
// ============================================================

const CURRICULUM = [
  // UNIT 1 — To Be & Pronouns
  { day:8,  title:"Short Forms — I'm, He's, They're",   topic:"to-be-contractions" },
  { day:9,  title:"'There is' and 'There are'",          topic:"there-is-are" },
  { day:10, title:"'There is' — Negatives & Questions",  topic:"there-is-are-neg" },
  { day:11, title:"Describing People — She is tall and kind", topic:"describing-people" },
  { day:12, title:"My Classroom & School",               topic:"school-vocabulary" },
  { day:13, title:"Week 2 Review — To Be & Pronouns",   topic:"review" },
  { day:14, title:"Week 2 Test",                         topic:"test" },
  { day:15, title:"Countries & Nationalities",           topic:"countries-nationalities" },
  { day:16, title:"Colours & Descriptions",              topic:"colours-descriptions" },
  { day:17, title:"Numbers 1–100",                       topic:"numbers-1-100" },
  { day:18, title:"My Family — Who is who?",             topic:"family" },
  { day:19, title:"Days, Months & Seasons",              topic:"dates-time" },
  { day:20, title:"Week 3 Review",                       topic:"review" },
  { day:21, title:"Week 3 Test",                         topic:"test" },
  { day:22, title:"Question Words — Who, What, Where",  topic:"question-words-1" },
  { day:23, title:"Question Words — When, Why, How",    topic:"question-words-2" },
  { day:24, title:"Wh- Questions with 'To Be'",         topic:"wh-questions-be" },
  { day:25, title:"My Home — Rooms and Furniture",      topic:"home-vocabulary" },
  { day:26, title:"Where is it? — Prepositions of Place", topic:"prepositions-basic" },
  { day:27, title:"Week 4 Review",                       topic:"review" },
  { day:28, title:"Week 4 Test",                         topic:"test" },
  { day:29, title:"Possessive Pronouns — my, your, his, her", topic:"possessives" },
  { day:30, title:"Possessive 's — Peter's book",       topic:"possessive-s" },
  { day:31, title:"This / That / These / Those",         topic:"demonstratives" },
  { day:32, title:"Asking About Things — What's this?", topic:"asking-about-things" },
  { day:33, title:"Unit 1 — Final Review",               topic:"review" },
  { day:34, title:"Unit 1 — Practice Day",               topic:"review" },
  { day:35, title:"Unit 1 — Final Test",                 topic:"test" },
  // UNIT 2 — Articles, Nouns
  { day:36, title:"Articles — 'a' and 'an'",             topic:"articles-a-an" },
  { day:37, title:"When to use 'the'",                   topic:"article-the" },
  { day:38, title:"When NOT to use an article",          topic:"no-article" },
  { day:39, title:"Singular & Plural Nouns",             topic:"plural-nouns" },
  { day:40, title:"Irregular Plurals — man/men, child/children", topic:"irregular-plurals" },
  { day:41, title:"Week Review",                         topic:"review" },
  { day:42, title:"Weekly Test",                         topic:"test" },
  { day:43, title:"Countable & Uncountable Nouns",       topic:"countable-uncountable" },
  { day:44, title:"Some & Any",                          topic:"some-any" },
  { day:45, title:"Much, Many, A lot of",                topic:"much-many" },
  { day:46, title:"Food Vocabulary & Uncountable Nouns", topic:"food-vocabulary" },
  { day:47, title:"Drinks & Containers",                 topic:"drinks-containers" },
  { day:48, title:"Week Review",                         topic:"review" },
  { day:49, title:"Weekly Test",                         topic:"test" },
  { day:50, title:"Basic Sentence Structure — SVO",      topic:"sentence-structure" },
  { day:51, title:"Simple Sentences — I like, I have, I want", topic:"simple-sentences" },
  { day:52, title:"Conjunctions — and, but, or",         topic:"conjunctions-basic" },
  { day:53, title:"because & so",                        topic:"because-so" },
  { day:54, title:"Describing Nouns with Adjectives",    topic:"noun-adjective" },
  { day:55, title:"Week Review",                         topic:"review" },
  { day:56, title:"Weekly Test",                         topic:"test" },
  { day:57, title:"Animals & Descriptions",              topic:"animals" },
  { day:58, title:"Sports & Hobbies",                    topic:"hobbies" },
  { day:59, title:"Technology & Gadgets",                topic:"technology" },
  { day:60, title:"Clothes & Getting Dressed",           topic:"clothes" },
  { day:61, title:"Shopping — Prices & Sizes",           topic:"shopping" },
  { day:62, title:"Week Review",                         topic:"review" },
  { day:63, title:"Weekly Test",                         topic:"test" },
  { day:64, title:"Body Parts & Health",                 topic:"body-health" },
  { day:65, title:"Feelings & Emotions",                 topic:"emotions" },
  { day:66, title:"Weather & Seasons",                   topic:"weather" },
  { day:67, title:"The Natural World",                   topic:"nature" },
  { day:68, title:"Unit 2 — Final Review",               topic:"review" },
  { day:69, title:"Unit 2 — Practice Day",               topic:"review" },
  { day:70, title:"Unit 2 — Final Test",                 topic:"test" },
  // UNIT 3 — Present Simple
  { day:71, title:"Present Simple — I do, I live",       topic:"present-simple-intro" },
  { day:72, title:"He/She/It — The 's' Rule",            topic:"present-simple-3rd" },
  { day:73, title:"Spelling Rules for -s/-es/-ies",      topic:"spelling-rules-s" },
  { day:74, title:"Present Simple — Negatives",          topic:"present-simple-neg" },
  { day:75, title:"Present Simple — Questions with 'do/does'", topic:"present-simple-q" },
  { day:76, title:"Week Review",                         topic:"review" },
  { day:77, title:"Weekly Test",                         topic:"test" },
  { day:78, title:"Time Expressions — always, usually, sometimes", topic:"adverbs-frequency" },
  { day:79, title:"Adverbs of Frequency — Placement",    topic:"adverb-placement" },
  { day:80, title:"Daily Routines",                      topic:"daily-routines" },
  { day:81, title:"School Subjects & Schedules",         topic:"school-schedule" },
  { day:82, title:"Likes and Dislikes",                  topic:"likes-dislikes" },
  { day:83, title:"Week Review",                         topic:"review" },
  { day:84, title:"Weekly Test",                         topic:"test" },
  { day:85, title:"Short Answers — Yes, he does / No, she doesn't", topic:"short-answers-ps" },
  { day:86, title:"Present Simple — Making Questions",   topic:"ps-question-practice" },
  { day:87, title:"Present Simple — Mixed Practice",     topic:"ps-mixed" },
  { day:88, title:"Talking About Habits",                topic:"habits" },
  { day:89, title:"Telling the Time",                    topic:"telling-time" },
  { day:90, title:"Week Review",                         topic:"review" },
  { day:91, title:"Weekly Test",                         topic:"test" },
  { day:92, title:"Talking About Jobs & Routines",       topic:"jobs-routines" },
  { day:93, title:"Present Simple — My Friend's Day",    topic:"ps-friend-day" },
  { day:94, title:"Verb 'have' and 'have got'",          topic:"have-have-got" },
  { day:95, title:"Verb 'like' + -ing vs to",            topic:"like-ing" },
  { day:96, title:"Unit 3 — Final Review",               topic:"review" },
  { day:97, title:"Unit 3 — Practice",                   topic:"review" },
  { day:98, title:"Unit 3 — Test",                       topic:"test" },
  // Days 99–105 buffer
  { day:99,  title:"Consolidation — Units 1–3",          topic:"review" },
  { day:100, title:"Milestone! Day 100 Celebration Test", topic:"test" },
  { day:101, title:"Common Mistakes — Units 1–3",        topic:"review" },
  { day:102, title:"Reading Practice — Short Text",      topic:"reading" },
  { day:103, title:"Vocabulary Building",                topic:"vocabulary" },
  { day:104, title:"Mixed Exercises Review",             topic:"review" },
  { day:105, title:"Unit 3 Wrap-up",                     topic:"review" },
  // UNIT 4 — Present Continuous
  { day:106, title:"Present Continuous — What are you doing?", topic:"present-cont-intro" },
  { day:107, title:"Spelling Rules — running, swimming, dancing", topic:"spelling-ing" },
  { day:108, title:"Present Continuous — Negatives",     topic:"pc-neg" },
  { day:109, title:"Present Continuous — Questions",     topic:"pc-q" },
  { day:110, title:"PS vs PC — Which one?",              topic:"ps-vs-pc" },
  { day:111, title:"Week Review",                        topic:"review" },
  { day:112, title:"Weekly Test",                        topic:"test" },
  { day:113, title:"Stative Verbs — love, know, need",   topic:"stative-verbs" },
  { day:114, title:"Actions happening NOW vs regularly", topic:"ps-pc-contrast" },
  { day:115, title:"Describing a Photo",                 topic:"describing-photo" },
  { day:116, title:"At the moment / right now / currently", topic:"time-markers-pc" },
  { day:117, title:"Present Continuous for future plans", topic:"pc-future" },
  { day:118, title:"Week Review",                        topic:"review" },
  { day:119, title:"Weekly Test",                        topic:"test" },
  { day:120, title:"Mixed PS + PC Practice",             topic:"ps-pc-mixed" },
  { day:121, title:"What is everyone doing?",            topic:"pc-scene" },
  { day:122, title:"Conversations — Present Continuous", topic:"pc-conversation" },
  { day:123, title:"Time expressions review",            topic:"time-expressions" },
  { day:124, title:"Unit 4 — Final Review",              topic:"review" },
  { day:125, title:"Unit 4 — Practice",                  topic:"review" },
  { day:126, title:"Unit 4 — Test",                      topic:"test" },
  { day:127, title:"Vocabulary — Action Verbs",          topic:"action-verbs" },
  { day:128, title:"Reading — A Day in the Life",        topic:"reading" },
  { day:129, title:"Consolidation — Units 1–4",          topic:"review" },
  { day:130, title:"Mixed Test — Units 1–4",             topic:"test" },
  { day:131, title:"Pronunciation — -s and -ing endings", topic:"pronunciation" },
  { day:132, title:"Common Mistakes Practice",           topic:"mistakes" },
  { day:133, title:"Free Writing Day",                   topic:"writing" },
  { day:134, title:"Listening comprehension (written)",  topic:"comprehension" },
  { day:135, title:"Mixed Practice Day",                 topic:"review" },
  { day:136, title:"Week Review",                        topic:"review" },
  { day:137, title:"Weekly Test",                        topic:"test" },
  { day:138, title:"Grammar Deep Dive Review",           topic:"review" },
  { day:139, title:"Vocabulary Expansion",               topic:"vocabulary" },
  { day:140, title:"Unit 4 Wrap-up",                     topic:"review" },
  // UNIT 5 — Past Simple
  { day:141, title:"Past Simple — I was, You were",      topic:"past-be" },
  { day:142, title:"Past Simple — Regular Verbs (-ed)",  topic:"past-regular" },
  { day:143, title:"Spelling Rules for -ed Verbs",       topic:"spelling-ed" },
  { day:144, title:"Past Simple — Negatives (didn't)",   topic:"past-neg" },
  { day:145, title:"Past Simple — Questions (Did you?)", topic:"past-q" },
  { day:146, title:"Week Review",                        topic:"review" },
  { day:147, title:"Weekly Test",                        topic:"test" },
  { day:148, title:"Irregular Verbs — The Most Common",  topic:"irregular-verbs-1" },
  { day:149, title:"Irregular Verbs — Group 2",          topic:"irregular-verbs-2" },
  { day:150, title:"Irregular Verbs — Group 3",          topic:"irregular-verbs-3" },
  { day:151, title:"Telling a Story — Yesterday I...",   topic:"past-storytelling" },
  { day:152, title:"Time expressions — yesterday, last, ago", topic:"past-time-expr" },
  { day:153, title:"Week Review",                        topic:"review" },
  { day:154, title:"Weekly Test",                        topic:"test" },
  { day:155, title:"Past Simple — Short Answers",        topic:"past-short-answers" },
  { day:156, title:"Past Was/Were — Questions & Negatives", topic:"past-be-full" },
  { day:157, title:"Reading — A Story in Past Simple",   topic:"past-reading" },
  { day:158, title:"Writing — My Weekend",               topic:"past-writing" },
  { day:159, title:"Mixed Past Simple Practice",         topic:"past-mixed" },
  { day:160, title:"Week Review",                        topic:"review" },
  { day:161, title:"Weekly Test",                        topic:"test" },
  { day:162, title:"Irregular Verbs — Full Review",      topic:"irregular-review" },
  { day:163, title:"Talking About the Past",             topic:"past-conversation" },
  { day:164, title:"My Favourite Day Ever",              topic:"past-writing-2" },
  { day:165, title:"Unit 5 — Final Review",              topic:"review" },
  { day:166, title:"Unit 5 — Test",                      topic:"test" },
  { day:167, title:"Consolidation — Units 1–5",          topic:"review" },
  { day:168, title:"Half-Year Celebration Test!",        topic:"test" },
  { day:169, title:"My Learning Journal — Half Year",    topic:"writing" },
  { day:170, title:"Mixed Grammar Practice",             topic:"review" },
  { day:171, title:"Vocabulary Review",                  topic:"vocabulary" },
  { day:172, title:"Reading Comprehension",              topic:"reading" },
  { day:173, title:"Writing Practice",                   topic:"writing" },
  { day:174, title:"Mixed Exercises",                    topic:"review" },
  { day:175, title:"Unit 5 Wrap-up",                     topic:"review" },
  // UNIT 6 — Future
  { day:176, title:"Future — 'will' for predictions",    topic:"will-future" },
  { day:177, title:"'will' — Negatives & Questions",     topic:"will-neg-q" },
  { day:178, title:"'going to' — Plans & Intentions",    topic:"going-to" },
  { day:179, title:"'going to' — Negatives & Questions", topic:"going-to-neg-q" },
  { day:180, title:"will vs going to — Which one?",      topic:"will-vs-going-to" },
  { day:181, title:"Week Review",                        topic:"review" },
  { day:182, title:"Weekly Test",                        topic:"test" },
  { day:183, title:"Future Time Expressions",            topic:"future-time-expr" },
  { day:184, title:"Talking About Future Plans",         topic:"future-plans" },
  { day:185, title:"Predictions — I think it will...",   topic:"predictions" },
  { day:186, title:"Writing — My Plans for Next Week",   topic:"future-writing" },
  { day:187, title:"Future Questions — What will you do?", topic:"future-q-practice" },
  { day:188, title:"Week Review",                        topic:"review" },
  { day:189, title:"Weekly Test",                        topic:"test" },
  { day:190, title:"Conditional — If + will (Zero/First)", topic:"conditional-1" },
  { day:191, title:"If it rains, I will stay home",      topic:"conditional-practice" },
  { day:192, title:"Mixed Future Practice",              topic:"future-mixed" },
  { day:193, title:"Unit 6 — Final Review",              topic:"review" },
  { day:194, title:"Unit 6 — Test",                      topic:"test" },
  { day:195, title:"Vocabulary — Future & Plans",        topic:"vocabulary" },
  { day:196, title:"Reading — My Future Goals",          topic:"reading" },
  { day:197, title:"Mixed Practice",                     topic:"review" },
  { day:198, title:"Consolidation Review",               topic:"review" },
  { day:199, title:"Mixed Test",                         topic:"test" },
  { day:200, title:"Day 200 Milestone! Special Lesson",  topic:"milestone" },
  { day:201, title:"Grammar Recap — Units 1–6",          topic:"review" },
  { day:202, title:"Vocabulary Day",                     topic:"vocabulary" },
  { day:203, title:"Reading Practice",                   topic:"reading" },
  { day:204, title:"Writing Practice",                   topic:"writing" },
  { day:205, title:"Mixed Grammar Exercises",            topic:"review" },
  { day:206, title:"Week Review",                        topic:"review" },
  { day:207, title:"Weekly Test",                        topic:"test" },
  { day:208, title:"Grammar Drilling Day",               topic:"review" },
  { day:209, title:"Vocabulary Expansion",               topic:"vocabulary" },
  { day:210, title:"Unit 6 Wrap-up",                     topic:"review" },
  // UNIT 7 — Questions & Negation
  { day:211, title:"Question Words — Full Revision",     topic:"wh-revision" },
  { day:212, title:"Subject vs Object Questions",        topic:"subject-object-q" },
  { day:213, title:"Tag Questions — isn't it?",          topic:"tag-questions" },
  { day:214, title:"Indirect Questions — Can you tell me…?", topic:"indirect-q" },
  { day:215, title:"Negative Questions — Aren't you…?", topic:"neg-questions" },
  { day:216, title:"Week Review",                        topic:"review" },
  { day:217, title:"Weekly Test",                        topic:"test" },
  { day:218, title:"Asking for information politely",    topic:"polite-q" },
  { day:219, title:"Questions in conversation",          topic:"q-conversation" },
  { day:220, title:"Negation — Summary of all tenses",  topic:"negation-summary" },
  { day:221, title:"Neither / Nor / Either",             topic:"neither-nor" },
  { day:222, title:"So do I / Neither do I",             topic:"so-neither" },
  { day:223, title:"Week Review",                        topic:"review" },
  { day:224, title:"Weekly Test",                        topic:"test" },
  { day:225, title:"Mixed Question Practice",            topic:"q-mixed" },
  { day:226, title:"Interview a Character",              topic:"writing" },
  { day:227, title:"Unit 7 — Final Review",              topic:"review" },
  { day:228, title:"Unit 7 — Test",                      topic:"test" },
  { day:229, title:"Mixed Grammar — Units 1–7",          topic:"review" },
  { day:230, title:"Vocabulary Day",                     topic:"vocabulary" },
  { day:231, title:"Reading Comprehension",              topic:"reading" },
  { day:232, title:"Writing Practice",                   topic:"writing" },
  { day:233, title:"Mixed Exercises",                    topic:"review" },
  { day:234, title:"Week Review",                        topic:"review" },
  { day:235, title:"Weekly Test",                        topic:"test" },
  { day:236, title:"Conversation Practice",              topic:"conversation" },
  { day:237, title:"Grammar Drilling",                   topic:"review" },
  { day:238, title:"Vocabulary Building",                topic:"vocabulary" },
  { day:239, title:"Reading & Questions",                topic:"reading" },
  { day:240, title:"Writing — Interview",                topic:"writing" },
  { day:241, title:"Week Review",                        topic:"review" },
  { day:242, title:"Weekly Test",                        topic:"test" },
  { day:243, title:"Consolidation Review",               topic:"review" },
  { day:244, title:"Mixed Practice",                     topic:"review" },
  { day:245, title:"Unit 7 Wrap-up",                     topic:"review" },
  // UNIT 8 — Adjectives & Comparison
  { day:246, title:"Adjectives — Order and Position",    topic:"adjective-order" },
  { day:247, title:"Comparatives — bigger, faster",      topic:"comparatives" },
  { day:248, title:"Spelling — comparative rules",       topic:"comparative-spelling" },
  { day:249, title:"Superlatives — the biggest, the best", topic:"superlatives" },
  { day:250, title:"Irregular: good/better/best",        topic:"irregular-comparison" },
  { day:251, title:"Week Review",                        topic:"review" },
  { day:252, title:"Weekly Test",                        topic:"test" },
  { day:253, title:"as ... as — equally big",            topic:"as-as" },
  { day:254, title:"much/a lot + comparative",           topic:"degree-comparison" },
  { day:255, title:"Describing appearance",              topic:"appearance" },
  { day:256, title:"Describing personality",             topic:"personality" },
  { day:257, title:"Comparing things & people",          topic:"comparing-practice" },
  { day:258, title:"Week Review",                        topic:"review" },
  { day:259, title:"Weekly Test",                        topic:"test" },
  { day:260, title:"Adverbs — quickly, slowly, well",    topic:"adverbs" },
  { day:261, title:"Adjective vs Adverb",                topic:"adj-vs-adv" },
  { day:262, title:"Mixed Adjective Practice",           topic:"adj-mixed" },
  { day:263, title:"Unit 8 — Final Review",              topic:"review" },
  { day:264, title:"Unit 8 — Test",                      topic:"test" },
  { day:265, title:"Writing — Compare Two Things",       topic:"writing" },
  { day:266, title:"Vocabulary — Adjective Pairs",       topic:"vocabulary" },
  { day:267, title:"Reading Practice",                   topic:"reading" },
  { day:268, title:"Mixed Practice",                     topic:"review" },
  { day:269, title:"Week Review",                        topic:"review" },
  { day:270, title:"Weekly Test",                        topic:"test" },
  { day:271, title:"Consolidation — Units 1–8",          topic:"review" },
  { day:272, title:"Mixed Test",                         topic:"test" },
  { day:273, title:"Vocabulary Day",                     topic:"vocabulary" },
  { day:274, title:"Writing Practice",                   topic:"writing" },
  { day:275, title:"Reading Comprehension",              topic:"reading" },
  { day:276, title:"Grammar Drilling",                   topic:"review" },
  { day:277, title:"Week Review",                        topic:"review" },
  { day:278, title:"Weekly Test",                        topic:"test" },
  { day:279, title:"Mixed Exercises",                    topic:"review" },
  { day:280, title:"Unit 8 Wrap-up",                     topic:"review" },
  // UNIT 9 — Prepositions
  { day:281, title:"Prepositions of Place",              topic:"prep-place" },
  { day:282, title:"Prepositions of Time — at, in, on",  topic:"prep-time" },
  { day:283, title:"Prepositions of Movement",           topic:"prep-movement" },
  { day:284, title:"Common Preposition Phrases",         topic:"prep-phrases" },
  { day:285, title:"Preposition Practice — Real Sentences", topic:"prep-practice" },
  { day:286, title:"Week Review",                        topic:"review" },
  { day:287, title:"Weekly Test",                        topic:"test" },
  { day:288, title:"Conjunctions — because, although, however", topic:"conjunctions-adv" },
  { day:289, title:"Relative Clauses — who, which, that", topic:"relative-clauses" },
  { day:290, title:"Linking ideas in writing",           topic:"linking-words" },
  { day:291, title:"First / Then / Finally",             topic:"sequence-words" },
  { day:292, title:"Mixed Preposition Practice",         topic:"prep-mixed" },
  { day:293, title:"Week Review",                        topic:"review" },
  { day:294, title:"Weekly Test",                        topic:"test" },
  { day:295, title:"Unit 9 — Final Review",              topic:"review" },
  { day:296, title:"Unit 9 — Test",                      topic:"test" },
  { day:297, title:"Vocabulary Day",                     topic:"vocabulary" },
  { day:298, title:"Reading Practice",                   topic:"reading" },
  { day:299, title:"Writing Practice",                   topic:"writing" },
  { day:300, title:"Day 300 Milestone!",                 topic:"milestone" },
  { day:301, title:"Consolidation — Units 1–9",          topic:"review" },
  { day:302, title:"Mixed Test",                         topic:"test" },
  { day:303, title:"Grammar Drilling",                   topic:"review" },
  { day:304, title:"Vocabulary Expansion",               topic:"vocabulary" },
  { day:305, title:"Reading Comprehension",              topic:"reading" },
  { day:306, title:"Week Review",                        topic:"review" },
  { day:307, title:"Weekly Test",                        topic:"test" },
  { day:308, title:"Mixed Exercises",                    topic:"review" },
  { day:309, title:"Writing Day",                        topic:"writing" },
  { day:310, title:"Conversation Practice",              topic:"conversation" },
  { day:311, title:"Grammar Review",                     topic:"review" },
  { day:312, title:"Vocabulary Review",                  topic:"vocabulary" },
  { day:313, title:"Week Review",                        topic:"review" },
  { day:314, title:"Weekly Test",                        topic:"test" },
  { day:315, title:"Unit 9 Wrap-up",                     topic:"review" },
  // UNIT 10 — Modal Verbs
  { day:316, title:"Can — ability and possibility",      topic:"can-ability" },
  { day:317, title:"Can't — impossibility & negation",   topic:"cant" },
  { day:318, title:"Can — Asking Permission",            topic:"can-permission" },
  { day:319, title:"Could — past ability",               topic:"could" },
  { day:320, title:"Could — polite requests",            topic:"could-polite" },
  { day:321, title:"Week Review",                        topic:"review" },
  { day:322, title:"Weekly Test",                        topic:"test" },
  { day:323, title:"Must & Have to — obligation",        topic:"must-have-to" },
  { day:324, title:"Mustn't vs Don't have to",           topic:"mustnt-vs-dont" },
  { day:325, title:"Should — advice",                    topic:"should" },
  { day:326, title:"Shouldn't — what to avoid",         topic:"shouldnt" },
  { day:327, title:"Modal Verbs — Mixed Practice",       topic:"modal-mixed" },
  { day:328, title:"Week Review",                        topic:"review" },
  { day:329, title:"Weekly Test",                        topic:"test" },
  { day:330, title:"May & Might — possibility",          topic:"may-might" },
  { day:331, title:"Would — conditional & polite",       topic:"would" },
  { day:332, title:"Would you like…? — Offers",         topic:"would-like" },
  { day:333, title:"Modal Verbs — Full Summary",         topic:"modal-summary" },
  { day:334, title:"Unit 10 — Final Review",             topic:"review" },
  { day:335, title:"Unit 10 — Test",                     topic:"test" },
  { day:336, title:"Vocabulary — Modal situations",      topic:"vocabulary" },
  { day:337, title:"Reading Practice",                   topic:"reading" },
  { day:338, title:"Writing — Give advice!",             topic:"writing" },
  { day:339, title:"Conversation — Modal verbs in use",  topic:"conversation" },
  { day:340, title:"Consolidation — All Units",          topic:"review" },
  { day:341, title:"Week Review",                        topic:"review" },
  { day:342, title:"Weekly Test",                        topic:"test" },
  { day:343, title:"Big Grammar Review",                 topic:"review" },
  { day:344, title:"Vocabulary — Full Year Review",      topic:"vocabulary" },
  { day:345, title:"Reading & Comprehension Practice",   topic:"reading" },
  { day:346, title:"Writing Practice",                   topic:"writing" },
  { day:347, title:"Week Review",                        topic:"review" },
  { day:348, title:"Weekly Test",                        topic:"test" },
  { day:349, title:"Mixed Grammar — All Tenses",         topic:"review" },
  { day:350, title:"Unit 10 Wrap-up",                    topic:"review" },
  // UNIT 11 — Consolidation
  { day:351, title:"Year Review — To Be & Pronouns",     topic:"year-review-1" },
  { day:352, title:"Year Review — Present Tenses",       topic:"year-review-2" },
  { day:353, title:"Year Review — Past Simple",          topic:"year-review-3" },
  { day:354, title:"Year Review — Future Forms",         topic:"year-review-4" },
  { day:355, title:"Year Review — Questions & Negation", topic:"year-review-5" },
  { day:356, title:"Week Review",                        topic:"review" },
  { day:357, title:"Year Review — Adjectives & Comparison", topic:"year-review-6" },
  { day:358, title:"Year Review — Modal Verbs",          topic:"year-review-7" },
  { day:359, title:"Year Review — Mixed Grammar",        topic:"year-review-8" },
  { day:360, title:"Final Test — Part 1 (Grammar)",      topic:"final-test" },
  { day:361, title:"Final Test — Part 2 (Vocabulary)",   topic:"final-test" },
  { day:362, title:"Final Test — Part 3 (Writing)",      topic:"final-test" },
  { day:363, title:"Year in Review — My Progress",       topic:"reflection" },
  { day:364, title:"Celebration Day — English Showcase", topic:"celebration" },
  { day:365, title:"🎉 Day 365 — You Did It!",            topic:"graduation" },
];

// ============================================================
//  AUTO-GENERATE LESSONS for days 8–365
// ============================================================

function generateLesson(dayNum, info) {
  const unit = getUnit(dayNum);
  const dayType = getDayType(dayNum);
  const topic = info.topic;

  // Generic subtitle
  const subtitleMap = {
    'review': 'Light practice and review. Go over what you have learned.',
    'test': 'Time to test your knowledge! Answer carefully.',
    'vocabulary': 'Building your vocabulary — new words and examples.',
    'reading': 'Reading comprehension practice.',
    'writing': 'Writing practice — express yourself in English!',
    'conversation': 'Conversation patterns and useful phrases.',
    'milestone': '🎉 Special milestone lesson! Look how far you have come.',
    'final-test': 'Final test — show everything you have learned this year.',
    'celebration': '🏆 Celebrate your achievement!',
    'graduation': '🎓 365 days complete. You are amazing!',
  };
  const subtitle = subtitleMap[topic] || `Today we study: ${info.title}. New grammar + examples + practice.`;

  const sections = [];

  // Explanation
  sections.push({
    type: 'explanation',
    title: '📖 Today\'s Focus',
    content: generateExplanation(dayNum, info.title, topic, unit),
    hungarian: generateHungarianNote(topic),
  });

  // Examples
  sections.push({
    type: 'examples',
    title: '💬 Examples',
    items: generateExamples(topic, info.title),
  });

  // Fill-in exercise
  sections.push({
    type: 'exercise-fill',
    title: '✏️ Practice — Fill in the blank',
    instruction: 'Complete the sentences:',
    items: generateFillItems(topic, unit.num),
  });

  // Choice exercise
  sections.push({
    type: 'exercise-choice',
    title: '🧠 Choose the correct answer',
    items: generateChoiceItems(topic, unit.num),
  });

  // Quiz
  sections.push({
    type: 'quiz',
    title: '🎯 Mini Quiz',
    questions: generateQuizQuestions(topic, unit.num, dayNum),
  });

  // Fun task
  sections.push({
    type: 'fun-task',
    emoji: pickEmoji(dayNum),
    title: pickFunTitle(dayNum, topic),
    desc: generateFunTask(topic, unit.num, dayNum),
  });

  return { title: info.title, subtitle, sections };
}

// ---- Content generators ----

function generateExplanation(day, title, topic, unit) {
  const explanations = {
    'to-be-contractions': `Short forms (contractions) make your English sound more natural.<br><br>
      <strong>I am</strong> → <strong>I'm</strong><br>
      <strong>You are</strong> → <strong>You're</strong><br>
      <strong>He is</strong> → <strong>He's</strong><br>
      <strong>She is</strong> → <strong>She's</strong><br>
      <strong>We are</strong> → <strong>We're</strong><br>
      <strong>They are</strong> → <strong>They're</strong><br><br>
      In speaking and informal writing, we almost always use the short form.`,
    'there-is-are': `We use <strong>"There is"</strong> for ONE thing and <strong>"There are"</strong> for MORE than one.<br><br>
      There <strong>is</strong> a cat in the garden. (1 cat)<br>
      There <strong>are</strong> three cats in the garden. (3 cats)<br><br>
      Think of it like this: "There is/are" tells us something EXISTS somewhere.`,
    'articles-a-an': `We use <strong>"a"</strong> before words starting with a consonant sound, and <strong>"an"</strong> before words starting with a vowel sound (a, e, i, o, u).<br><br>
      a dog, a book, a student<br>
      an apple, an egg, an idea, an hour (silent h!)`,
    'present-simple-intro': `The Present Simple is used for things that happen <strong>regularly</strong> or are always true.<br><br>
      I <strong>eat</strong> breakfast every morning.<br>
      She <strong>speaks</strong> English very well.<br>
      The sun <strong>rises</strong> in the east.<br><br>
      For I/You/We/They: use the base verb.<br>
      For He/She/It: add <strong>-s</strong> to the verb!`,
    'past-regular': `For the Past Simple of regular verbs, add <strong>-ed</strong> to the verb.<br><br>
      work → work<strong>ed</strong><br>
      play → play<strong>ed</strong><br>
      watch → watch<strong>ed</strong><br>
      live → liv<strong>ed</strong> (drop the e, add -ed)<br>
      stop → stop<strong>ped</strong> (double the consonant)`,
    'will-future': `We use <strong>"will"</strong> to talk about the future — predictions, decisions made at the moment, or promises.<br><br>
      I think it <strong>will</strong> rain tomorrow.<br>
      I <strong>will</strong> help you! (a promise)<br>
      <strong>Will</strong> is the same for ALL persons — no changes!`,
    'can-ability': `We use <strong>"can"</strong> to say someone is able to do something.<br><br>
      I <strong>can</strong> swim. (képes vagyok úszni)<br>
      She <strong>can</strong> speak three languages.<br>
      <strong>Can</strong> is the same for ALL persons. Never add -s!<br><br>
      Negative: <strong>can't</strong> (= cannot)`,
    'must-have-to': `Both <strong>"must"</strong> and <strong>"have to"</strong> express obligation — something necessary.<br><br>
      You <strong>must</strong> study. (internal obligation / rule)<br>
      I <strong>have to</strong> be home by 9pm. (external obligation)<br><br>
      In practice, they are often interchangeable.`,
    'comparatives': `To compare two things, we add <strong>-er</strong> to short adjectives, or use <strong>"more"</strong> before long adjectives.<br><br>
      big → bigg<strong>er</strong><br>
      fast → fast<strong>er</strong><br>
      beautiful → <strong>more</strong> beautiful<br>
      interesting → <strong>more</strong> interesting<br><br>
      Always use <strong>"than"</strong> after the comparative: She is taller <strong>than</strong> me.`,
    'should': `We use <strong>"should"</strong> to give advice — to say what is a good idea.<br><br>
      You <strong>should</strong> drink more water. (good advice)<br>
      He <strong>should</strong> study harder. (suggestion)<br>
      You <strong>shouldn't</strong> eat too much sugar. (negative advice)`,
  };
  return explanations[topic] ||
    `Today we study: <strong>${title}</strong>.<br><br>
    Read the examples carefully. Notice the patterns. Then try the exercises!<br><br>
    Remember: making mistakes is how we learn. Try everything, check your answers, and keep going! 💪`;
}

function generateHungarianNote(topic) {
  const notes = {
    'to-be-contractions': "A rövid formákat (I'm, he's stb.) mindig használjuk beszédben és informális írásban.",
    'there-is-are': "'There is/are' = Létezik valami valahol. Magyarban: 'Van egy macska a kertben.'",
    'articles-a-an': "'a' mássalhangzó előtt, 'an' magánhangzó (a,e,i,o,u) előtt. Magyarul nincs névelő ezzel a különbséggel!",
    'present-simple-intro': "A jelen egyszerű általános igazságokhoz és szokásokhoz. He/She/It után -s végzet kerül az igére!",
    'past-regular': "Szabályos igéknél a múlt idő képzése: alapige + -ed. Egyszerű!",
    'will-future': "'Will' a jövőre vonatkozó jóslásokhoz és ígéretekhez. Minden személlyel ugyanolyan marad!",
    'can-ability': "'Can' = tud, képes valamire. Soha nem kap -s végzetet, még he/she/it esetén sem!",
    'should': "'Should' = kellene, tanács adásához. Negatív: shouldn't = nem kellene.",
    'comparatives': "Rövid mellékneveknél -er végzet, hosszabbaknál 'more' + melléknév. Összehasonlítás: ...than.",
  };
  return notes[topic] || 'Olvasd el figyelmesen a példákat, és próbáld ki a feladatokat!';
}

function generateExamples(topic, title) {
  const exampleSets = {
    'to-be-contractions': [
      { en: "I'm a student.", hu: "Diák vagyok.", focus: "I'm" },
      { en: "You're very kind.", hu: "Nagyon kedves vagy.", focus: "You're" },
      { en: "He's my best friend.", hu: "A legjobb barátom.", focus: "He's" },
      { en: "She's 14 years old.", hu: "14 éves.", focus: "She's" },
      { en: "We're from Hungary.", hu: "Magyarországról vagyunk.", focus: "We're" },
      { en: "They're really funny.", hu: "Nagyon viccesek.", focus: "They're" },
      { en: "It's a great day!", hu: "Nagyszerű nap!", focus: "It's" },
    ],
    'articles-a-an': [
      { en: "I have a dog.", hu: "Van egy kutyám.", focus: "a" },
      { en: "She is an engineer.", hu: "Mérnök.", focus: "an" },
      { en: "He ate an apple.", hu: "Evett egy almát.", focus: "an" },
      { en: "It is a beautiful day.", hu: "Gyönyörű nap van.", focus: "a" },
      { en: "She is an honest person.", hu: "Becsületes ember.", focus: "an" },
      { en: "I need a pen.", hu: "Kell egy tollam.", focus: "a" },
      { en: "This is an interesting book.", hu: "Ez egy érdekes könyv.", focus: "an" },
    ],
    'present-simple-intro': [
      { en: "I eat breakfast at 7am.", hu: "7-kor reggelizem.", focus: "eat" },
      { en: "She reads every night.", hu: "Minden este olvas.", focus: "reads" },
      { en: "They play football on Saturdays.", hu: "Szombatonta fociznak.", focus: "play" },
      { en: "He works in a hospital.", hu: "Kórházban dolgozik.", focus: "works" },
      { en: "The sun rises in the east.", hu: "A nap keleten kel fel.", focus: "rises" },
      { en: "We go to school by bus.", hu: "Busszal járunk iskolába.", focus: "go" },
      { en: "My cat sleeps a lot.", hu: "A macskám sokat alszik.", focus: "sleeps" },
    ],
    'comparatives': [
      { en: "She is taller than me.", hu: "Ő magasabb nálam.", focus: "taller than" },
      { en: "This book is more interesting.", hu: "Ez a könyv érdekesebb.", focus: "more interesting" },
      { en: "Summer is hotter than winter.", hu: "A nyár melegebb a télnél.", focus: "hotter than" },
      { en: "My dog is bigger than yours.", hu: "Az én kutyám nagyobb mint a tied.", focus: "bigger than" },
      { en: "English is easier than people think.", hu: "Az angol könnyebb mint gondolják.", focus: "easier than" },
      { en: "He runs faster than I do.", hu: "Gyorsabban fut nálam.", focus: "faster than" },
    ],
    'can-ability': [
      { en: "I can swim.", hu: "Tudok úszni.", focus: "can" },
      { en: "She can speak French.", hu: "Tud franciául.", focus: "can" },
      { en: "They can play guitar.", hu: "Tudnak gitározni.", focus: "can" },
      { en: "He can't drive yet.", hu: "Még nem tud vezetni.", focus: "can't" },
      { en: "Can you help me?", hu: "Tudsz segíteni?", focus: "Can" },
      { en: "We can meet tomorrow.", hu: "Holnap találkozhatunk.", focus: "can" },
      { en: "She can run very fast.", hu: "Nagyon gyorsan tud futni.", focus: "can" },
    ],
  };
  return exampleSets[topic] || [
    { en: "I study English every day.", hu: "Minden nap angolul tanulok.", focus: "study" },
    { en: "She speaks very well.", hu: "Nagyon jól beszél.", focus: "speaks" },
    { en: "We are learning grammar.", hu: "Grammatikát tanulunk.", focus: "are learning" },
    { en: "He didn't understand the question.", hu: "Nem értette a kérdést.", focus: "didn't" },
    { en: "They will practise tomorrow.", hu: "Holnap gyakorolnak majd.", focus: "will practise" },
    { en: "Can you speak English?", hu: "Tudsz angolul?", focus: "Can" },
    { en: "You should read more.", hu: "Többet kellene olvasnod.", focus: "should" },
  ];
}

function generateFillItems(topic, unitNum) {
  const sets = {
    'to-be-contractions': [
      { prompt: "___ happy today. (I am)", answer: "I'm", hint: "I am = I'm" },
      { prompt: "___ my best friend. (He is)", answer: "He's", hint: "He is = He's" },
      { prompt: "___ really kind. (She is)", answer: "She's", hint: "She is = She's" },
      { prompt: "___ at school. (We are)", answer: "We're", hint: "We are = We're" },
      { prompt: "___ great students. (They are)", answer: "They're", hint: "They are = They're" },
    ],
    'articles-a-an': [
      { prompt: "She is ___ engineer.", answer: "an", hint: "vowel sound → an" },
      { prompt: "I have ___ dog.", answer: "a", hint: "consonant sound → a" },
      { prompt: "He ate ___ apple.", answer: "an", hint: "vowel sound → an" },
      { prompt: "That is ___ big house.", answer: "a", hint: "consonant sound → a" },
      { prompt: "She is ___ honest girl.", answer: "an", hint: "'h' is silent → an" },
    ],
    'present-simple-intro': [
      { prompt: "She ___ (read) every day.", answer: "reads", hint: "She → reads" },
      { prompt: "They ___ (play) football.", answer: "play", hint: "They → play" },
      { prompt: "He ___ (work) in London.", answer: "works", hint: "He → works" },
      { prompt: "I ___ (like) music.", answer: "like", hint: "I → like" },
      { prompt: "The cat ___ (sleep) a lot.", answer: "sleeps", hint: "The cat = it → sleeps" },
    ],
    'can-ability': [
      { prompt: "I ___ swim very fast.", answer: "can", hint: "ability → can" },
      { prompt: "She ___ speak three languages.", answer: "can", hint: "ability → can" },
      { prompt: "He ___ drive. He is too young.", answer: "can't", hint: "negative → can't" },
      { prompt: "___ you play the guitar?", answer: "Can", hint: "question → Can" },
      { prompt: "They ___ help us tomorrow.", answer: "can", hint: "possibility → can" },
    ],
  };
  return sets[topic] || [
    { prompt: "I ___ a student.", answer: "am", hint: "I → am" },
    { prompt: "She ___ from Hungary.", answer: "is", hint: "She → is" },
    { prompt: "They ___ at school.", answer: "are", hint: "They → are" },
    { prompt: "He ___ happy.", answer: "is", hint: "He → is" },
    { prompt: "We ___ tired.", answer: "are", hint: "We → are" },
  ];
}

function generateChoiceItems(topic, unitNum) {
  const sets = {
    'articles-a-an': [
      { prompt: "She wants to be ___ doctor.", choices: ['a','an','the'], answer: 'a' },
      { prompt: "I saw ___ eagle in the park.", choices: ['a','an','the'], answer: 'an' },
      { prompt: "He has ___ umbrella.", choices: ['a','an','the'], answer: 'an' },
    ],
    'present-simple-intro': [
      { prompt: "He ___ football every Saturday.", choices: ['play','plays','playing'], answer: 'plays' },
      { prompt: "They ___ to school by bus.", choices: ['goes','go','going'], answer: 'go' },
      { prompt: "She ___ French and English.", choices: ['speak','speaks','speaking'], answer: 'speaks' },
    ],
    'can-ability': [
      { prompt: "She ___ speak three languages.", choices: ['can','cans','is can'], answer: 'can' },
      { prompt: "___ you come to the party?", choices: ['Does','Is','Can'], answer: 'Can' },
      { prompt: "He ___ fly. He's afraid of planes.", choices: ["can't","doesn't can","isn't can"], answer: "can't" },
    ],
    'comparatives': [
      { prompt: "She is ___ than her brother.", choices: ['tall','taller','tallest'], answer: 'taller' },
      { prompt: "This film is ___ interesting than that one.", choices: ['more','most','much'], answer: 'more' },
      { prompt: "My bag is ___ than yours.", choices: ['heavy','heavyer','heavier'], answer: 'heavier' },
    ],
  };
  return sets[topic] || [
    { prompt: "I ___ happy today.", choices: ['am','is','are'], answer: 'am' },
    { prompt: "She ___ at school.", choices: ['am','is','are'], answer: 'is' },
    { prompt: "They ___ my friends.", choices: ['am','is','are'], answer: 'are' },
  ];
}

function generateQuizQuestions(topic, unitNum, day) {
  const sets = {
    'to-be-contractions': [
      { q: 'What is the short form of "They are"?', choices: ["They're","Theyre","They is"], answer: "They're" },
      { q: 'Which is correct?', choices: ["She's happy.","She're happy.","She'm happy."], answer: "She's happy." },
      { q: 'What does "We\'re" mean?', choices: ['We is','We am','We are'], answer: 'We are' },
      { q: 'Which is correct?', choices: ["I'm not tired.","I're not tired.","I is not tired."], answer: "I'm not tired." },
    ],
    'articles-a-an': [
      { q: '"an" is used before words starting with...', choices: ['a vowel sound','a consonant','any word'], answer: 'a vowel sound' },
      { q: 'Which is correct?', choices: ['a apple','an apple','the apple (first time)'], answer: 'an apple' },
      { q: '"a hour" or "an hour"?', choices: ['a hour','an hour','the hour'], answer: 'an hour' },
      { q: 'Which is correct?', choices: ['She is a engineer.','She is an engineer.','She is engineer.'], answer: 'She is an engineer.' },
    ],
    'can-ability': [
      { q: 'Which is correct?', choices: ['She cans swim.','She can swims.','She can swim.'], answer: 'She can swim.' },
      { q: 'Negative of "I can fly":',choices:["I can't fly.","I don't can fly.","I am not can fly."], answer:"I can't fly." },
      { q: 'How do you ask "Tudsz úszni?"', choices:['Do you can swim?','Are you can swim?','Can you swim?'], answer:'Can you swim?' },
      { q: '"Can" changes form for He/She/It?', choices:['Yes, add -s','Yes, add -es','No, it stays "can"'], answer:'No, it stays "can"' },
    ],
  };
  // Generic fallback with some variety based on day
  return sets[topic] || [
    { q: 'Which sentence uses correct grammar?', choices:['I am a student.','I is a student.','I are a student.'], answer:'I am a student.' },
    { q: 'Which is the correct plural?', choices:['childs','childrens','children'], answer:'children' },
    { q: 'Choose the right question form:', choices:['Does she speaks English?','Does she speak English?','Do she speaks English?'], answer:'Does she speak English?' },
    { q: 'The past of "go" is:', choices:['goed','went','goes'], answer:'went' },
  ];
}

function pickEmoji(day) {
  const emojis = ['✍️','🎯','🚀','💡','📝','🌟','🎮','🏆','💪','🧠','📚','🎨','⚽','🎵','🌍'];
  return emojis[day % emojis.length];
}
function pickFunTitle(day, topic) {
  const reviewTitles = ['Quick Review!','Go Back Over This!','Check What You Know!'];
  const writingTitles = ['Your Turn to Write!','Express Yourself!','Creative Challenge!'];
  const genericTitles = ['Your Turn!','Practice Challenge!','Real Life Task!','Fun Task!','Apply What You Know!'];
  if (topic === 'review' || topic === 'test') return reviewTitles[day % reviewTitles.length];
  if (topic === 'writing') return writingTitles[day % writingTitles.length];
  return genericTitles[day % genericTitles.length];
}
function generateFunTask(topic, unitNum, day) {
  const tasks = [
    'Write 3 sentences about your day. Use what you learned today.',
    'Think of 3 people you know. Write a sentence about each using today\'s grammar.',
    'Look around the room. Write 3 sentences describing what you see.',
    'Write 3 questions you would ask a new friend. Use today\'s grammar.',
    'Write a short paragraph (4 sentences) about your favourite hobby.',
    'Compare two things you know (people, animals, places). Write 3 sentences.',
    'Write 3 things you CAN do and 2 things you CANNOT do.',
    'Write what you did yesterday. Use 4 sentences.',
    'Describe your ideal day. Use future forms: "I will...", "I\'m going to..."',
    'Write 3 sentences of advice for a new student starting school.',
    'Describe your bedroom in 4 sentences.',
    'Write 3 sentences about your best friend.',
  ];
  return tasks[day % tasks.length];
}

// ============================================================
//  BUILD ALL 365 LESSONS
// ============================================================

const ALL_LESSONS = {};

// Days 1–7: fully written
for (let d = 1; d <= 7; d++) {
  const fl = FULL_LESSONS[d];
  ALL_LESSONS[d] = {
    day: d,
    unit: getUnit(d),
    dayType: getDayType(d),
    title: fl.title,
    subtitle: fl.subtitle,
    sections: fl.sections,
  };
}

// Days 8–365: generated
for (const info of CURRICULUM) {
  const d = info.day;
  if (d <= 7) continue;
  const generated = generateLesson(d, info);
  ALL_LESSONS[d] = {
    day: d,
    unit: getUnit(d),
    dayType: info.topic === 'review' ? 'review' : info.topic === 'test' ? 'test' : getDayType(d),
    title: generated.title,
    subtitle: generated.subtitle,
    sections: generated.sections,
  };
}

// Expose
window.ALL_LESSONS = ALL_LESSONS;
window.UNITS = UNITS;
window.getUnit = getUnit;
window.getDayType = getDayType;
