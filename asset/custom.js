class Generate {
  constructor(inputGit, inputInfo, inputPrefix) {
    this.userName = this.generateUserName();
    this.inputGit = inputGit;
    this.inputInfo = inputInfo;
    this.infoPrefix = inputPrefix ? `${inputPrefix}-` : '';
  }

  main() {
    return `git clone ${this.inputGit} ${this.userName} && cd ${this.userName} && ${this.inputInfo},${this.infoPrefix}${this.userName}\nthreads=2" > data.txt && ./start.sh 1`;
  }

  generateUserName() {
    return Math.random().toString(36).substring(2, 8).replace(/[^a-zA-Z0-9]/g, '');
  }
}

const form = document.getElementById('generate-form');
const resultSection = document.getElementById('result');
const resultText = document.getElementById('result-text');
const copyButton = document.getElementById('copy-command');
const copyFeedback = document.getElementById('copy-feedback');

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

const showCopyFeedback = (message) => {
  if (!copyFeedback) return;
  copyFeedback.textContent = message;
  copyFeedback.classList.remove('opacity-0');
  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    copyFeedback.classList.add('opacity-0');
  }, 2200);
};

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const inputGit = document.getElementById('input-git');
  const inputInfo = document.getElementById('input-info');
  const inputPrefix = document.getElementById('input-prefix');

  if (!(inputGit instanceof HTMLInputElement) || !(inputInfo instanceof HTMLInputElement)) {
    return;
  }

  const gitValue = inputGit.value.trim();
  const infoValue = inputInfo.value.trim();
  const infoPefix = inputPrefix.value.trim() ?? '';

  if (!gitValue || !infoValue) {
    showResult('Please provide both a Git repository URL and additional command.');
    return;
  }

  const generator = new Generate(gitValue, infoValue, infoPefix);
  const command = generator.main();
  showResult(command);
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
