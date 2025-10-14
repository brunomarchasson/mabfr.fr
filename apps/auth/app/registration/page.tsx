'use client';
import { AuthProvider, useAuth, AuthButton } from '@mabru/ui';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

// This is the shape of the Kratos API response for a registration flow
interface KratosRegistrationFlow {
  ui: {
    action: string;
    method: string;
    nodes: Array<{
      group: string;
      attributes: {
        name: string;
        value: any;
      };
    }>;
  };
}

// This function finds a specific node in the UI nodes array
const findNode = (nodes: KratosRegistrationFlow['ui']['nodes'], name: string) => {
  return nodes.find((node) => node.attributes.name === name);
};

function RegistrationHandler() {
  const searchParams = useSearchParams();
  const flowId = searchParams.get('flow');
  const [flow, setFlow] = useState<KratosRegistrationFlow | null>(null);

  useEffect(() => {
    if (!flowId) {
      return;
    }

    fetch(`http://localhost/kratos/self-service/registration/flows?id=${flowId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((flowData: KratosRegistrationFlow) => {
        setFlow(flowData);
        console.log('Registration flow data:', flowData);
        const messages = flowData.ui.nodes?.map((n: any) => n.messages).flat();
        // If the flow has no messages, we can proceed with the OIDC auto-submission.
        // If it has messages, it means there was a validation error (like from our webhook),
        // and we should display them instead of looping.
        if (!messages) {
          const csrfTokenNode = findNode(flowData.ui.nodes, 'csrf_token');
          const googleProviderNode = findNode(flowData.ui.nodes, 'provider');

          if (!csrfTokenNode || !googleProviderNode) {
            console.error("Could not find CSRF token or Google provider in flow object");
            return;
          }

          const form = document.createElement('form');
          form.method = flowData.ui.method;
          form.action = flowData.ui.action;

          const csrfInput = document.createElement('input');
          csrfInput.type = 'hidden';
          csrfInput.name = 'csrf_token';
          csrfInput.value = csrfTokenNode.attributes.value;
          form.appendChild(csrfInput);

          const providerInput = document.createElement('input');
          providerInput.type = 'hidden';
          providerInput.name = 'provider';
          providerInput.value = 'google';
          form.appendChild(providerInput);

          const methodInput = document.createElement('input');
          methodInput.type = 'hidden';
          methodInput.name = 'method';
          methodInput.value = 'oidc';
          form.appendChild(methodInput);

          document.body.appendChild(form);
          // form.submit();
        }
      })
      .catch((err) => {
        console.error("Failed to fetch Kratos registration flow", err);
      });
  }, [flowId]);
  const messages = flow?.ui?.nodes?.map((n: any) => n.messages).flat();
  // If the flow contains messages, display them.
  if (messages) {
    return (
      <AuthProvider>

      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Accès non autorisé</h1>
        {
          messages.map((msg, idx) => (
            <p key={idx} className="max-w-md text-red-500">{msg.text}</p>
          ))
        }
        <div className="mt-8">
          <AuthButton />
        </div>
      </div>
        </AuthProvider>
    );
  }

  return (
    <div>
      <h1>Finalizing registration...</h1>
      <p>Please wait.</p>
    </div>
  );
}

export default function RegistrationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegistrationHandler />
    </Suspense>
  );
}
