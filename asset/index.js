class Generate {
  constructor(inputKeyWords, inputInfo, inputPrefix) {
    this.inputKeyWords = inputKeyWords;
    this.userName = this.generateUserName();
    this.inputInfo = inputInfo;
    this.infoPrefix = inputPrefix ? `${inputPrefix}-` : '';
  }

  main() {
    // replace all this.inputKeyWords with this.userName
    const replacedInfo = this.inputInfo?.replace(new RegExp(`\\${this.inputKeyWords}`, 'g'), this.userName);
    return replacedInfo?.replace(`c=RVN,${this.userName}`, `c=RVN,${this.infoPrefix}${this.userName}`);
  }

  mainSimple() {
    return `cd ${this.userName} && ./start.sh 1`;
  }

  generateUserName() {
    return Math.random().toString(36).substring(2, 8).replace(/[^a-zA-Z0-9]/g, '');
  }
}

const form = document.getElementById('generate-form-simple');
const resultSection = document.getElementById('result');
const resultText = document.getElementById('result-text');
const resultSectionSimple = document.getElementById('result-simple');
const resultTextSimple = document.getElementById('result-text-simple');
const copyButton = document.getElementById('copy-command');
const copyFeedback = document.getElementById('copy-feedback');
const copyButtonSimple = document.getElementById('copy-command-simple');
const copyFeedbackSimple = document.getElementById('copy-feedback-simple');
const STORAGE_KEY = 'generate-form-data';

let feedbackTimer;

const resetFeedback = () => {
  if (!copyFeedback) return;
  window.clearTimeout(feedbackTimer);
  copyFeedback.textContent = '';
  copyFeedback.classList.add('opacity-0');
};

const showResult = (command) => {
  if (!resultSection || !resultText) return;
  resultText.textContent = command;
  resultSection.classList.remove('hidden');
  resetFeedback();
};

const showResultSimple = (command) => {
  if (!resultSectionSimple || !resultTextSimple) return;
  resultTextSimple.textContent = command;
  resultSectionSimple.classList.remove('hidden');
  resetFeedback();
};

const showCopyFeedback = (message) => {
  if (!copyFeedback) return;
  copyFeedback.textContent = message;
  copyFeedback.classList.remove('opacity-0');
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    copyFeedback.classList.add('opacity-0');
  }, 2200);
};

const saveFormValues = (values) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
  } catch {
    // ignore write errors (storage unavailable)
  }
};

const loadFormValues = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const populateFormValues = () => {
  const storedValues = loadFormValues();
  if (!storedValues) return;

  const inputInfo = document.getElementById('input-info');
  const inputPrefix = document.getElementById('input-prefix');
  const inputKeyWords = document.getElementById('input-key-words');

  if (inputInfo && typeof storedValues.infoValue === 'string') {
    inputInfo.value = storedValues.infoValue;
  }

  if (inputPrefix && typeof storedValues.infoPrefixValue === 'string') {
    inputPrefix.value = storedValues.infoPrefixValue;
  }

  if (inputKeyWords && typeof storedValues.keyWords === 'string') {
    inputKeyWords.value = storedValues.keyWords;
  }

  if (storedValues.infoValue) {
    const generator = new Generate(storedValues.keyWords ?? '', storedValues.infoValue, storedValues.infoPrefixValue ?? '');
    showResult(generator.main());
    showResultSimple(generator.mainSimple());
  }
};

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputInfo = document.getElementById('input-info');
  const inputPrefix = document.getElementById('input-prefix');
  const inputKeyWords = document.getElementById('input-key-words');
  const infoValue = inputInfo?.value?.trim() ?? '';
  const infoPrefixValue = inputPrefix?.value?.trim() ?? '';
  const keyWords = inputKeyWords?.value?.trim() ?? '';

  if (!infoValue) {
    showResult('Please provide additional command.');
    return;
  }

  saveFormValues({ infoValue, infoPrefixValue, keyWords });

  const generator = new Generate(keyWords, infoValue, infoPrefixValue);
  const command = generator.main();
  const commandSimple = generator.mainSimple();
  showResult(command);
  showResultSimple(commandSimple);
});

copyButton?.addEventListener('click', async () => {
  if (!resultText) return;

  const command = resultText.textContent ?? '';
  if (!command) {
    return;
  }

  try {
    await navigator.clipboard.writeText(command);
    showCopyFeedback('Copied to clipboard');
  } catch (error) {
    showCopyFeedback('Copy failed. Select the text and copy manually.');
  }
});

copyButtonSimple?.addEventListener('click', async () => {
  if (!resultTextSimple) return;

  const command = resultTextSimple.textContent ?? '';
  if (!command) {
    return;
  }

  try {
    await navigator.clipboard.writeText(command);
    showCopyFeedback('Copied to clipboard');
  } catch (error) {
    showCopyFeedback('Copy failed. Select the text and copy manually.');
  }
});

populateFormValues();
