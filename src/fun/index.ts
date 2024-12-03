import SBC from "../components/SBC.vue";

type SBCBody = {
    profile: string;
    filename: string;
    subs: Array<string>;
}

async function sbc(body: SBCBody) {
    try {
        const mergedProfile = body.profile ? JSON.parse(body.profile) : {};
        if (!mergedProfile.outbounds) {
            mergedProfile.outbounds = [];
        }

        let xs = body.subs.map(async (sub) => {
            const response = await fetch(sub);
            const profile = await response.json();
            /* 			Buffer.from(profile, 'base64').toString('utf8') */
            console.log(`Fetched profile from: ${sub} ${profile.outbounds}`);
            return (profile.outbounds || [])
                .filter(outbound => !['urltest', 'selector', 'direct', 'dns', 'block'].includes(outbound.type));
        })

        xs = (await Promise.all(xs)).flat();
        xs = mergedProfile.outbounds.concat(xs);
        console.log(xs);
        const xsMap = new Map(xs.map(x => [`${x.server}:${x.server_port}`, x]));
        console.log(xsMap);
        mergedProfile.outbounds = Array.from(xsMap.values());

        // Send the merged profile as a downloadable file
        const fileBlob = new Blob([JSON.stringify(mergedProfile, null, 2)], { type: 'application/octet-stream' });
        return new Response(fileBlob, {
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': `attachment; filename="${body.filename}"`
            }
        });
    } catch (e) {
        console.log(e);
        return new Response(e.message, { status: 500 });
    }

}

async function digest(text, digest_name = 'SHA-256') {
    const myText = new TextEncoder().encode(text);

    const myDigest = await crypto.subtle.digest(
        {
            name: digest_name,
        },
        myText // The data you want to hash as an ArrayBuffer
    );

    const hexString = [...new Uint8Array(myDigest)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')

    return hexString;
}


const isDev = import.meta.env.DEV;

export {
    sbc,
    digest,
    type SBCBody,
    isDev,
}
