import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'expenses.json');

function readExpenses() {
  if (!fs.existsSync(filePath)) return [];
  try {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
  } catch (err) {
    return [];
  }
}

function writeExpenses(data: any[]) {
  const dirPath = path.dirname(filePath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

export async function GET() {
  const expenses = readExpenses();
  return NextResponse.json({ expenses });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const expenses = readExpenses();

    const newExpense = {
      id: Date.now().toString(),
      billNumber: body.billNumber || '',
      expenseName: body.expenseName,
      amount: Number(body.amount),
      date: body.date,
      carId: body.carId,
    };

    expenses.push(newExpense);
    writeExpenses(expenses);

    return NextResponse.json({ success: true, expense: newExpense });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create expense' }, { status: 500 });
  }
}

// 🟢 Edit Expense
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    let expenses = readExpenses();

    expenses = expenses.map((item: any) =>
      item.id === body.id
        ? {
            ...item,
            billNumber: body.billNumber || '',
            expenseName: body.expenseName,
            amount: Number(body.amount),
            date: body.date,
            carId: body.carId,
          }
        : item
    );

    writeExpenses(expenses);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update expense' }, { status: 500 });
  }
}

// 🟢 Delete Expense
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    let expenses = readExpenses();
    expenses = expenses.filter((item: any) => item.id !== id);
    writeExpenses(expenses);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete expense' }, { status: 500 });
  }
}