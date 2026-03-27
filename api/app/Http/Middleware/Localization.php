<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Symfony\Component\HttpFoundation\Response;

class Localization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->hasHeader('Accept-Language')) {
            $locale = $request->header('Accept-Language');
            // Basic check for supported locales (en, ar)
            // You might want to parse the header properly if it contains weights (e.g. en-US,en;q=0.9)
            // For simplicity, we assume the frontend sends 'en' or 'ar'
            
            $supported = ['en', 'ar'];
            
            // If the header contains comma-separated values, take the first one
            $locale = explode(',', $locale)[0];
            $locale = trim($locale);

            if (in_array($locale, $supported)) {
                App::setLocale($locale);
            }
        }

        return $next($request);
    }
}
