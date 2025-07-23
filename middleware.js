// middleware.js

// Не импортируем из 'next/server', используем нативные Web API
// (Request, Response, URL, Headers)

const ALLOWED_IP = '5.59.98.46';

export async function middleware(request) {
  // Получаем IP-адрес клиента
  // Vercel предоставляет IP в заголовке 'x-forwarded-for' или request.ip
  // В Edge Functions на Vercel лучше всего полагаться на x-forwarded-for
  // Также можно попробовать request.headers.get('x-real-ip')
  const clientIp = request.headers.get('x-forwarded-for') || request.ip;

  console.log(`Request from IP: ${clientIp}`);

  if (clientIp === ALLOWED_IP) {
    // Если IP совпадает, выполняем перенаправление на /home.html
    const redirectUrl = new URL('/home.html', request.url);
    return Response.redirect(redirectUrl.toString(), 302); // 302 Found
  } else {
    // Если IP не совпадает, "переписываем" URL на /index.html
    // Это значит, что браузер останется на текущем URL, но получит контент index.html
    const rewriteUrl = new URL('/index.html', request.url);
    return new Response(null, {
        status: 200,
        headers: {
            'x-middleware-rewrite': rewriteUrl.pathname, // Специальный заголовок Vercel для rewrite
        },
    });
    // Альтернатива (если x-middleware-rewrite не срабатывает для вас):
    // const res = new Response(await fetch(rewriteUrl.toString()).then(r => r.text()), {
    //   status: 200,
    //   headers: { 'content-type': 'text/html' }
    // });
    // return res;
  }
}

// Конфигурация, чтобы Middleware срабатывал на всех запросах к корневому пути
export const config = {
  matcher: '/', // Применяем Middleware ко всем запросам на корневой путь
};
