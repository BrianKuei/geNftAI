interface IUseTonKeeper {
  amount: number;
  fallbackFunc?(): void;
}

export function useTonKeeper({ amount, fallbackFunc }: IUseTonKeeper) {
  const TARGET = `ton://transfer/kQBp58MUqqirN6VdsW6f_UxfLKo9xVFpEt2RCQtOT4uaylwX?amount=${amount}`;

  const timeout = 3000;

  setTimeout(function appNotInstalled() {
    if (!document.hidden) {
      console.error("no app installed!");
      fallbackFunc && fallbackFunc();
    } else {
      window.close();
    }
  }, timeout);

  window.location.replace(TARGET);
}

export default useTonKeeper;
