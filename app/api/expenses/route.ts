import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'expenses.json');

// Folder ra JSON File na-bhae aafai banaune helper function
async function ensureFileExists() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }

  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, '[]', 'utf-8');
  }
}

// GET: Sabai Expenses tanna lai
export async function GET() {
  try {
    await ensureFileExists();
    const fileData = await fs.readFile(filePath, 'utf-8');
    const expenses = JSON.parse(fileData);
    return NextResponse.json({ expenses });
  } catch (error) {
    return NextResponse.json({ expenses: [] });
  }
}

// POST: Naya Expense Save garna lai
export async function POST(req: Request) {
  try {
    await ensureFileExists();
    const body = await req.json();
    const { billNumber, expenseName, amount, date, carId } = body;

    if (!expenseName || !amount || !date) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    const fileData = await fs.readFile(filePath, 'utf-8');
    const expenses = JSON.parse(fileData);

    const newExpense = {
      id: Date.now().toString(),
      billNumber: billNumber || 'N/A',
      expenseName,
      amount: Number(amount),
      date,
      carId,
      createdAt: new Date().toISOString(),
    };

    expenses.unshift(newExpense);
    await fs.writeFile(filePath, JSON.stringify(expenses, null, 2), 'utf-8');

    return NextResponse.json({ success: true, expense: newExpense });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save expense' }, { status: 500 });
  }
}