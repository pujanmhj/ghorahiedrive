import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// JSON file path (लोकल र server/deployment को लागि storage path)
const dataFilePath = path.join(process.cwd(), 'data', 'expenses.json');

// Helper to read expenses
function getExpensesFromFile() {
  try {
    if (!fs.existsSync(dataFilePath)) {
      return [];
    }
    const fileData = fs.readFileSync(dataFilePath, 'utf8');
    return JSON.parse(fileData || '[]');
  } catch (error) {
    console.error('Error reading expenses file:', error);
    return [];
  }
}

// Helper to save expenses
function saveExpensesToFile(expenses: any[]) {
  try {
    const dirPath = path.dirname(dataFilePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(expenses, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing expenses file:', error);
  }
}

// 1. GET: सबै Expense हरू ल्याउने
export async function GET() {
  const expenses = getExpensesFromFile();
  return NextResponse.json({ expenses });
}

// 2. POST: नयाँ Expense थप्ने
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const expenses = getExpensesFromFile();

    const newExpense = {
      id: Date.now().toString(),
      billNumber: body.billNumber || '',
      expenseName: body.expenseName,
      amount: Number(body.amount),
      date: body.date,
      carId: body.carId || '',
    };

    expenses.unshift(newExpense);
    saveExpensesToFile(expenses);

    return NextResponse.json({ success: true, expenses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

// 3. PUT: Expense EDIT / UPDATE गर्ने
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    let expenses = getExpensesFromFile();

    const index = expenses.findIndex((item: any) => String(item.id) === String(body.id));

    if (index === -1) {
      return NextResponse.json({ error: 'Expense not found' }, { status: 404 });
    }

    expenses[index] = {
      ...expenses[index],
      billNumber: body.billNumber,
      expenseName: body.expenseName,
      amount: Number(body.amount),
      date: body.date,
      carId: body.carId,
    };

    saveExpensesToFile(expenses);

    return NextResponse.json({ success: true, expenses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

// 4. DELETE: Expense DELETE गर्ने
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    let expenses = getExpensesFromFile();
    expenses = expenses.filter((item: any) => String(item.id) !== String(id));

    saveExpensesToFile(expenses);

    return NextResponse.json({ success: true, expenses });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}