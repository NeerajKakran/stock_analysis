export default function handler(req, res) {
    if (req.method === "POST") {
        console.log("Received Webhook Data:", req.body);
        return res.status(200).json({ message: "Webhook received successfully" });
    } else if (req.method === "GET") {
        return res.status(200).json({ message: "Webhook is live!" });
    } else {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}
