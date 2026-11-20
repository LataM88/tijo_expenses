import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Row, Typography, Alert } from 'antd';
import { useForm } from 'react-hook-form';
import type { LoginRequest, Signup } from '../../types/types';
import { useLogin, useRegister } from '../../hooks/useAuth';
import { Button } from '../../components/Button/Button';
import styles from './AuthPage.module.css';

const { Title, Text } = Typography;

export const AuthPage = () => {
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const navigate = useNavigate();

  // Formularz logowania
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    reset: resetLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginRequest>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  // Formularz rejestracji
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    reset: resetSignup,
    formState: { errors: signupErrors },
  } = useForm<Signup>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const onLoginSubmit = (data: LoginRequest) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        resetLogin();
        navigate('/dashboard');
      },
    });
  };

  const onSignupSubmit = (data: Signup) => {
    registerMutation.mutate(data, {
      onSuccess: () => resetSignup(),
    });
  };

  return (
    <div className={styles.pageWrapper}>
      <Row className={styles.fullHeight}>
        {/*lewa strona ekran logowania*/}
        <Col xs={24} lg={12} className={styles.leftPanel}>
          <div className={styles.panelContent}>
            <div className={styles.sectionHeader}>
              <span className={styles.stepBadge}>01 / WITAJ PONOWNIE</span>
              <Title level={1} className={styles.heading}>
                Dobrze Cię widzieć.
              </Title>
              <Text className={styles.subtitle}>
                Zaloguj się i sprawdź, jak mają się Twoje finanse.
              </Text>
            </div>

            {loginMutation.error && (
              <div className={styles.alertWrapper}>
                <Alert type="error" message={loginMutation.error.message} showIcon closable />
              </div>
            )}
            {loginMutation.isSuccess && (
              <div className={styles.alertWrapper}>
                <Alert type="success" message="Zalogowano pomyślnie!" showIcon />
              </div>
            )}

            <form onSubmit={handleLoginSubmit(onLoginSubmit)} className={styles.form} noValidate>
              <div className={styles.formGroup}>
                <label htmlFor="login_email">Adres e-mail</label>
                <input
                  type="email"
                  id="login_email"
                  placeholder="jan@przyklad.pl"
                  className={loginErrors.email ? styles.inputError : ''}
                  {...registerLogin('email', {
                    required: 'Adres email jest wymagany',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Wprowadź prawidłowy format adresu email',
                    },
                  })}
                />
                {loginErrors.email && (
                  <span className={styles.errorMessage}>{loginErrors.email.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="login_password">Hasło</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    id="login_password"
                    placeholder="Wpisz hasło"
                    className={loginErrors.password ? styles.inputError : ''}
                    {...registerLogin('password', {
                      required: 'Hasło jest wymagane',
                    })}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowLoginPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showLoginPassword ? '🙈' : '👁'}
                  </button>
                </div>
                {loginErrors.password && (
                  <span className={styles.errorMessage}>{loginErrors.password.message}</span>
                )}
              </div>

              <Button
                type="submit"
                text={loginMutation.isPending ? 'Logowanie...' : 'Zaloguj się'}
                disabled={loginMutation.isPending}
              />
            </form>

            <p className={styles.footerText}>Twoje wydatki. Twój spokój.</p>
          </div>
        </Col>

        {/*prawa strona ekran rejestracji*/}
        <Col xs={24} lg={12} className={styles.rightPanel}>
          <div className={styles.panelContent}>
            <div className={styles.sectionHeader}>
              <span className={styles.stepBadge}>02 / ZACZNIJ OD SIEBIE</span>
              <Title level={1} className={styles.heading}>
                Mały krok do <span className={styles.headingBlock}>lepszych finansów.</span>
              </Title>
              <Text className={styles.subtitle}>
                Załóż bezpłatne konto. Resztę uporządkujemy razem.
              </Text>
            </div>

            {registerMutation.error && (
              <div className={styles.alertWrapper}>
                <Alert type="error" message={registerMutation.error.message} showIcon closable />
              </div>
            )}
            {registerMutation.isSuccess && (
              <div className={styles.alertWrapper}>
                <Alert
                  type="success"
                  message="Konto zostało utworzone! Możesz się teraz zalogować."
                  showIcon
                />
              </div>
            )}

            <form onSubmit={handleSignupSubmit(onSignupSubmit)} className={styles.form} noValidate>
              <div className={styles.formGroup}>
                <label htmlFor="first_name">Imię</label>
                <input
                  type="text"
                  id="first_name"
                  placeholder="Jak masz na imię?"
                  className={signupErrors.first_name ? styles.inputError : ''}
                  {...registerSignup('first_name', {
                    required: 'Imię jest wymagane',
                    minLength: {
                      value: 2,
                      message: 'Imię musi mieć przynajmniej 2 litery',
                    },
                  })}
                />
                {signupErrors.first_name && (
                  <span className={styles.errorMessage}>{signupErrors.first_name.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="signup_email">Adres e-mail</label>
                <input
                  type="email"
                  id="signup_email"
                  placeholder="twoj@przyklad.pl"
                  className={signupErrors.email ? styles.inputError : ''}
                  {...registerSignup('email', {
                    required: 'Adres e-mail jest wymagany',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Wprowadź prawidłowy format adresu email',
                    },
                  })}
                />
                {signupErrors.email && (
                  <span className={styles.errorMessage}>{signupErrors.email.message}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="signup_password">Hasło</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    id="signup_password"
                    placeholder="Utwórz bezpieczne hasło"
                    className={signupErrors.password ? styles.inputError : ''}
                    {...registerSignup('password', {
                      required: 'Hasło jest wymagane',
                      pattern: {
                        value: /(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                        message: 'Minimum 8 znaków, wielka litera, cyfra i znak specjalny',
                      },
                    })}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowSignupPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showSignupPassword ? '🙈' : '👁'}
                  </button>
                </div>
                <span className={styles.hintText}>
                  Minimum 8 znaków, w tym cyfra i wielka litera.
                </span>
                {signupErrors.password && (
                  <span className={styles.errorMessage}>{signupErrors.password.message}</span>
                )}
              </div>

              <Button
                type="submit"
                text={registerMutation.isPending ? 'Tworzenie...' : 'Utwórz konto'}
                disabled={registerMutation.isPending}
              />
            </form>

            <p className={styles.footerText}>Bez opłat. Bez zbędnych komplikacji.</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AuthPage;
