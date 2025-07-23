// middleware.js (или _middleware.ts)

import { NextResponse } from 'next/server';

const ALLOWED_IP = '5.59.98.46';

export async function middleware(req) {
  const clientIp = req.ip || req.headers.get('x-forwarded-for'); // Vercel часто предоставляет IP в req.ip

  console.log(`Request from IP: ${clientIp}`);

  if (clientIp === ALLOWED_IP) {
    // Если IP совпадает, перенаправляем на home.html
    // Используем NextResponse.redirect для выполнения HTTP-редиректа
    const url = req.nextUrl.clone();
    url.pathname = '/home.html'; // Устанавливаем путь к home.html
    return NextResponse.redirect(url);
  } else {
    // Если IP не совпадает, переписываем URL так, чтобы Vercel отдал index.html
    // Это означает, что браузер останется на текущем URL, но получит контент index.html
    const url = req.nextUrl.clone();
    url.pathname = '/index.html'; // Устанавливаем путь к index.html
    return NextResponse.rewrite(url);
  }
}

// Конфигурация, чтобы Middleware срабатывал на всех запросах к корневому пути
export const config = {
  matcher: '/', // Применяем Middleware ко всем запросам на корневой путь
};
