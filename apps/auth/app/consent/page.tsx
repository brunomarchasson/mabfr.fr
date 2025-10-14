import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// The Hydra admin URL is internal to the Docker network and accessed via its exposed port
const HYDRA_ADMIN_URL = 'http://localhost:4445';

async function acceptConsent(challenge: string) {
  try {
    // 1. Fetch the consent request from Hydra
    const hydraAdminUrl = 'http://localhost:4445';
    const getConsentRes = await fetch(`${hydraAdminUrl}/oauth2/auth/requests/consent?consent_challenge=${challenge}`);
    if (!getConsentRes.ok) {
      throw new Error(`Failed to fetch consent request: ${await getConsentRes.text()}`);
    }
    const consentRequest = await getConsentRes.json();

    // The subject of the consent request is the Kratos Identity ID
    const userId = consentRequest.subject;
    if (!userId) {
      throw new Error("Hydra did not provide a user subject in the consent request.");
    }

    // 2. Fetch the identity directly from the Kratos Admin API using the ID
    const kratosAdminUrl = 'http://localhost/kratos-admin/admin';
    const getIdentityRes = await fetch(`${kratosAdminUrl}/identities/${userId}`);
    if (!getIdentityRes.ok) {
      throw new Error(`Failed to fetch identity ${userId} from Kratos: ${await getIdentityRes.text()}`);
    }
    const identity = await getIdentityRes.json();

    // 3. Accept the consent request in Hydra, passing the user's traits in the ID token
    const body = {
      grant_scope: consentRequest.requested_scope,
      remember: true,
      remember_for: 3600,
      session: {
        id_token: {
          email: identity.traits.email,
          name: identity.traits.name,
          picture: identity.traits.picture,
        }
      }
    };

    const putConsentRes = await fetch(`${hydraAdminUrl}/oauth2/auth/requests/consent/accept?consent_challenge=${challenge}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!putConsentRes.ok) {
      throw new Error(`Failed to accept consent request: ${await putConsentRes.text()}`);
    }

    const acceptData = await putConsentRes.json();
    return acceptData.redirect_to;

  } catch (error) {
    console.error("Consent acceptance failed:", error);
    return '/error';
  }
}

export default async function ConsentPage({ searchParams }: { searchParams: { consent_challenge: string } }) {
  const challenge = (await searchParams).consent_challenge;

  if (!challenge) {
    return (
      <div>
        <h1>Consent challenge is missing.</h1>
        <p>Please try the login process again.</p>
      </div>
    );
  }

  const redirectTo = await acceptConsent(challenge);
  
  redirect(redirectTo);
}
