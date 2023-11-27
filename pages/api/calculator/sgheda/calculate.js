import { getServerSession } from "next-auth";
import dbConnect from "server/dbConnect";
import Account from "server/model/account.model";
import History from "server/model/history.model";
import { authOptions } from "../../auth/[...nextauth]";
import axios from "axios";

export default async function handler(req, res) {
    await dbConnect();

    // Verify the session
    const session = await getServerSession(req, res, authOptions);
    console.log(session, "session");
    if (!session) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    switch (req.method) {
        case "POST":
            const { inputData } = req.body;
            try {
                const account = await Account.findOne({
                    email: session.user.email
                });

                if (!account) {
                    return res.status(404).json({
                        success: false,
                        message: "Account not found!"
                    });
                }

                console.log(inputData);

                const response = await axios.post(
                    "http://slinkyghxdesign.com:8000/sgheda",
                    inputData,
                    {
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (response.status !== 200) {
                    return res
                        .status(400)
                        .json({ success: false, error: response.data.error });
                }

                const history = await History.create({
                    user: account._id,
                    inputData: JSON.stringify(inputData),
                    outputData: JSON.stringify(response.data),
                    type: "SGHEDA",
                    amount: 30
                });

                await history.save();

                res.status(200).json({ success: true, data: response.data });
            } catch (error) {
                console.log(error);
                res.status(400).json({ success: false, error: error.message });
            }
            break;
        default:
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}