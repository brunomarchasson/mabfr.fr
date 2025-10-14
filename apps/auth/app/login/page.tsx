'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

// This is the shape of the Kratos API response for a login flow
interface KratosLoginFlow {
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
const findNode = (nodes: KratosLoginFlow['ui']['nodes'], name: string) => {
  return nodes.find((node) => node.attributes.name === name);
};

function LoginHandler() {
  const searchParams = useSearchParams();
  const flowId = searchParams.get('flow');

  useEffect(() => {
    if (!flowId) {
      // We should not be on this page without a flow ID.
      return;
    }
  console.log('aa');
    // Fetch the login flow details from Kratos
    fetch(`http://localhost/kratos/self-service/login/flows?id=${flowId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((flow: KratosLoginFlow) => {
        console.log('ee')
        const csrfTokenNode = findNode(flow.ui.nodes, 'csrf_token');
        const googleProviderNode = findNode(flow.ui.nodes, 'provider');

        if (!csrfTokenNode || !googleProviderNode) {
          console.error("Could not find CSRF token or Google provider in flow object");
          return;
        }

        // This is the URL we need to POST to
        const actionUrl = flow.ui.action;

        // We create a form and submit it programmatically to trigger the OIDC flow
        const form = document.createElement('form');
        form.method = flow.ui.method;
        form.action = actionUrl;

        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = 'csrf_token';
        csrfInput.value = csrfTokenNode.attributes.value;
        form.appendChild(csrfInput);

        const providerInput = document.createElement('input');
        providerInput.type = 'hidden';
        providerInput.name = 'provider';
        providerInput.value = googleProviderNode.attributes.value; // This will be 'google'
        form.appendChild(providerInput);

        const methodInput = document.createElement('input');
        methodInput.type = 'hidden';
        methodInput.name = 'method';
        methodInput.value = 'oidc';
        form.appendChild(methodInput);

        document.body.appendChild(form);
        form.submit();
      })
      .catch((err) => {
        console.error("Failed to fetch Kratos login flow", err);
      });
  }, [flowId]);

  return (
    <div>
      <h1>Redirecting to login...</h1>
      <p>Please wait.</p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginHandler />
    </Suspense>
  );
}