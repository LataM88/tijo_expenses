import { Col, Row, Typography, Alert } from 'antd';
import { useForm } from 'react-hook-form';
import type { Signup } from '../../types/types';
import { useRegister } from '../../hooks/useRegister';
import { Button } from '../../components/Button/Button';
import styles from './Auth.module.css';

const { Title, Paragraph, Text } = Typography;

export const AuthPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Signup>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const { mutate, isPending, error, isSuccess } = useRegister();

  const onSubmit = (data: Signup) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className={styles.container}>
      <Row justify="center" align="middle" style={{ width: '100%' }}>
        <Col xs={24} sm={20} md={14} lg={10} xl={8}>
          <div className={styles.authCard}>
            <div className={styles.introduction}>
              <Paragraph className={styles.stepBadge}>01/ REJESTRACJA</Paragraph>
              <Title level={2} style={{ margin: '0 0 8px 0' }}>
                Stwórz konto
              </Title>
              <Text type="secondary">
                Zarejestruj się i sprawdź, jak mają się Twoje finanse
              </Text>
            </div>

            {error && (
              <div className={styles.alertWrapper}>
                <Alert
                  type="error"
                  message={error.message}
                  showIcon
                  closable
                />
              </div>
            )}

            {isSuccess && (
              <div className={styles.alertWrapper}>
                <Alert
                  type="success"
                  message="Konto zostało pomyślnie utworzone! Możesz się teraz zalogować."
                  showIcon
                />
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              className={styles.form}
              noValidate
            >
              <div className={styles.formGroup}>
                <label htmlFor="first_name">Wpisz imię</label>
                <input
                  type="text"
                  id="first_name"
                  placeholder="np. Jan"
                  className={errors.first_name ? styles.inputError : ''}
                  {...register('first_name', {
                    required: 'Imię jest wymagane',
                    minLength: {
                      value: 2,
                      message: 'Imię musi mieć przynajmniej 2 litery',
                    },
                  })}
                />
                {errors.first_name && (
                  <span className={styles.errorMessage}>
                    {errors.first_name.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Podaj adres email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="np. jan@example.com"
                  className={errors.email ? styles.inputError : ''}
                  {...register('email', {
                    required: 'Adres e-mail jest wymagany',
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Wprowadź prawidłowy format adresu email',
                    },
                  })}
                />
                {errors.email && (
                  <span className={styles.errorMessage}>
                    {errors.email.message}
                  </span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Wprowadź hasło</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Minimum 8 znaków"
                  className={errors.password ? styles.inputError : ''}
                  {...register('password', {
                    required: 'Hasło jest wymagane',
                    pattern: {
                      value: /(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
                      message:
                        'Hasło musi zawierać co najmniej 8 znaków, jedną wielką literę, jedną liczbę i jeden znak specjalny',
                    },
                  })}
                />
                {errors.password && (
                  <span className={styles.errorMessage}>
                    {errors.password.message}
                  </span>
                )}
              </div>

              <div className={styles.submitWrapper}>
                <Button
                  type="submit"
                  text={isPending ? 'Rejestracja...' : 'Zarejestruj się'}
                  disabled={isPending}
                />
              </div>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AuthPage;
