import { type NextRequest, NextResponse } from 'next/server'

// This is the shape of the Kratos identity object we receive in the hook
interface KratosIdentity {
  id: string;
  traits: {
    email: string;
    [key: string]: any;
  };
}

/**
 * This webhook is called by Kratos after a new user completes registration.
 * It checks if the new user's email is in the whitelist defined in the ALLOWED_EMAILS environment variable.
 * If the email is not in the list, it interrupts the flow with a 403 error.
 */
export async function POST(request: NextRequest) {
  try {
    const identity = (await request.json()) as KratosIdentity;

    if (!identity || !identity.traits.email) {
      console.warn("Webhook received a payload without an identity or email.");
      return NextResponse.json({ message: "Payload incomplete" });
    }

    const allowedEmailsStr = process.env.ALLOWED_EMAILS || '';
    const allowedEmails = allowedEmailsStr.split(',').map(e => e.trim()).filter(e => e);

    // If the whitelist is empty, allow everyone.
    if (allowedEmails.length === 0) {
      console.log("Whitelist is empty, allowing registration.");
      return NextResponse.json({ message: "Whitelist not configured, allowing." });
    }

    const userEmail = identity.traits.email;
    const isAllowed = allowedEmails.includes(userEmail);

    if (isAllowed) {
      console.log(`User with email ${userEmail} is on the whitelist. Allowing registration.`);
      return NextResponse.json({ message: "User is allowed." });
    }

    // User is NOT on the whitelist. Interrupt the flow by returning a validation error.
    console.log(`User with email ${userEmail} is not on the whitelist. Interrupting registration.`);
    return NextResponse.json({
      "messages": [
        {
          "instance_ptr": "#/traits/email",
          "messages": [
            {
              "id": 1001, // Custom error ID for this case
              "text": "This email address is not authorized to use this application.",
              "type": "error",
              "context": {
                "reason": "not_in_whitelist"
              }
            }
          ]
        }
      ]
    }, { status: 400 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Error processing registration webhook:", errorMessage);
    // Return a 500 error to Kratos to indicate a failure in the hook itself.
    return NextResponse.json({ error: "Internal server error in webhook" }, { status: 500 });
  }
}
