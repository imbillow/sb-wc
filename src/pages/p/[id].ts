import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request, locals, site }) => {
    const id = params.id;
    const sb = locals.runtime.env.sb;
    const text = await sb.get(id);

    return new Response(JSON.stringify({
        id: id,
        text: text,
    }));
}
