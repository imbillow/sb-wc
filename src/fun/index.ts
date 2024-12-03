import SBC from "../components/SBC.vue";

type SBCBody = {
    profile: string;
    filename: string;
    subs: Array<string>;
}

async function sbc(body: SBCBody) {
    try {
        const mergedProfile = JSON.parse(body.profile);
        if (!mergedProfile.outbounds) {
            mergedProfile.outbounds = [];
        }

        for (const profileUrl of body.subs) {
            const response = await fetch(profileUrl);
            const profile = await response.json();
            /* 			Buffer.from(profile, 'base64').toString('utf8') */
            console.log(`Fetched profile from: ${profileUrl} ${profile.outbounds}`);

            const outbounds = (profile.outbounds || [])
                .filter(outbound => !['urltest', 'selector', 'direct', 'dns', 'block'].includes(outbound.type));
            mergedProfile.outbounds = mergedProfile.outbounds.concat(outbounds);
        }

        // Deduplicate outbounds
        const uniqueOutbounds = new Map(mergedProfile.outbounds.map(outbound => [outbound.server, outbound]));
        mergedProfile.outbounds = Array.from(uniqueOutbounds.values());

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
        return new Response('', { status: 500 });
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

export {
    sbc,
    digest,
    type SBCBody
}
