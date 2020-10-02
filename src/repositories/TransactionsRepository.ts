import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

interface AllResponse {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): AllResponse {
    return {
      transactions: this.transactions,
      balance: this.getBalance(),
    };
  }

  public getBalance(): Balance {
    const reducer = (acc: number, cur: number): number => acc + cur;

    const income = this.transactions
      .filter(transaction => transaction.type === 'income')
      .map(incomeItem => incomeItem.value)
      .reduce(reducer, 0);

    const outcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .map(outcomeItem => outcomeItem.value)
      .reduce(reducer, 0);

    return {
      income,
      outcome,
      total: income - outcome,
    };
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    if (type === 'outcome') {
      const balance = this.getBalance();
      if (balance.total - value < 0) {
        throw new Error(`You don't have enough money`);
      }
    }
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
