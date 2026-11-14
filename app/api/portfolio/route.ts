import { NextResponse } from 'next/server';
import { getPortfolioContent } from '../../../lib/portfolio';
export const dynamic='force-dynamic';
export async function GET(){return NextResponse.json(await getPortfolioContent(),{headers:{'Cache-Control':'no-store'}});}
