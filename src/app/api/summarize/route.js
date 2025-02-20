export async function POST(req) {
    try {
        const { url, input } = await req.json();
        const response = await fetch("http://localhost:8000/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url, input }),
        });
        
        console.log(response);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: error.message  }, { status: 500 });
    }
}
