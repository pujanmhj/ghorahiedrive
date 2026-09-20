import { NextResponse } from 'next/server';
import { AuthError, getSessionUser, requireSession } from '@/lib/auth';
import {
  listExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  isStoreError,
} from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const expenses = await listExpenses();
  return NextResponse.json({ expenses });
}

export async function POST(request: Request) {
  try {
    await requireSession('admin');
    const body = await request.json();

    const expenseName = String(body.expenseName || '').trim();
    const amount = Number(body.amount);
    const date = String(body.date || '').trim();
    const billNumber = body.billNumber ? String(body.billNumber).trim() : '';
    const carId = body.carId ? String(body.carId).trim() : '';

    if (!expenseName || isNaN(amount) || !date) {
      return NextResponse.json(
        { error: 'Expense name, valid amount, and date are required.' },
        { status: 400 }
      );
    }

    const expense = await createExpense({
      billNumber,
      expenseName,
      amount,
      date,
      carId,
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    if (isStoreError && isStoreError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[expenses POST]', error);
    return NextResponse.json({ error: 'Could not add expense.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireSession('admin');
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required.' }, { status: 400 });
    }

    const updated = await updateExpense(id, data);
    if (!updated) {
      return NextResponse.json({ error: 'Expense not found.' }, { status: 404 });
    }

    return NextResponse.json({ expense: updated });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[expenses PUT]', error);
    return NextResponse.json({ error: 'Could not update expense.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireSession('admin');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required.' }, { status: 400 });
    }

    await deleteExpense(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[expenses DELETE]', error);
    return NextResponse.json({ error: 'Could not delete expense.' }, { status: 500 });
  }
}