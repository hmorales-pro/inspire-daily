import { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        navigate('/');
      }
      if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
      if (event === 'PASSWORD_RECOVERY') {
        toast({
          title: "Réinitialisation du mot de passe",
          description: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe.",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-primary-light p-4 flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-primary-dark mb-8">
          Connexion
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#333333',
                }
              }
            }
          }}
          theme="light"
          providers={['google']}
          redirectTo={window.location.origin}
          localization={{
            variables: {
              sign_in: {
                email_input_placeholder: 'Votre email',
                password_input_placeholder: 'Votre mot de passe',
                email_label: 'Email',
                password_label: 'Mot de passe',
                button_label: 'Se connecter',
                loading_button_label: 'Connexion en cours...',
                social_provider_text: 'Se connecter avec {{provider}}',
                link_text: "Vous n'avez pas de compte ? Inscrivez-vous",
                password_recovery: {
                  button_label: "Mot de passe oublié ?",
                  message: "Nous vous enverrons un lien pour réinitialiser votre mot de passe.",
                },
                error_message: {
                  email_required: "L'email est requis",
                  password_required: "Le mot de passe est requis",
                  invalid_credentials: "Email ou mot de passe incorrect",
                }
              },
              sign_up: {
                email_input_placeholder: 'Votre email',
                password_input_placeholder: 'Votre mot de passe',
                email_label: 'Email',
                password_label: 'Mot de passe',
                button_label: "S'inscrire",
                loading_button_label: 'Inscription en cours...',
                social_provider_text: "S'inscrire avec {{provider}}",
                link_text: "Vous avez déjà un compte ? Connectez-vous",
                confirmation_text: "Vérifiez votre email pour confirmer votre inscription",
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Login;