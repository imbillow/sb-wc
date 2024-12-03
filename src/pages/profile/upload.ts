import type { APIRoute } from "astro"
import { digest } from "../../fun";

export const POST: APIRoute = async ({ request, locals, url }) => {
    const text = await request.body?.getReader().read().then(r => r.value ? new TextDecoder().decode(r.value) : '');
    const [hashName, hashString] = request.headers.get('x-content-digest')?.split('=');
    console.log(text, hashName, hashString);

    const rehash = await digest(text);
    if (rehash !== hashString) {
        return new Response(JSON.stringify({
            message: "Hash mismatch",
            url: ''
        }), {
            status: 400
        });
    }

    try {
        console.log(locals.runtime.env.sb);
        const sb = locals.runtime.env.sb;
        await sb.put(hashString, text);
        const generated_url = `${url.origin}/p/${hashString}`;
        return new Response(JSON.stringify({
            message: "Stored",
            url: generated_url,
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        console.log(e);
        return new Response(e.message,
            {
                status: 500
            }
        );
    }

}
