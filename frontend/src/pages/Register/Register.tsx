import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { authStore } from '../../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>(
    {}
  );
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = 'Email обязателен';
    else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i.test(email)) newErrors.email = 'Неверный email';
    if (!password) newErrors.password = 'Пароль обязателен';
    else if (password.length < 4) newErrors.password = 'Минимум 4 символа';
    if (password !== confirm) newErrors.confirm = 'Пароли не совпадают';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await authStore.register(email, password);
    if (!authStore.error) navigate('/login');
  };

  return (
    <motion.div
      className="max-w-md mx-auto mt-24 p-6 bg-white rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>

      <form onSubmit={handleSubmit}>
        <Input
          label="Email"
          value={email}
          onChange={setEmail}
          error={errors.email}
          required
        />
        <Input
          label="Пароль"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          required
        />
        <Input
          label="Повторите пароль"
          type="password"
          value={confirm}
          onChange={setConfirm}
          error={errors.confirm}
          required
        />

        {authStore.error && (
          <motion.p
            className="text-red-500 text-sm mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {authStore.error}
          </motion.p>
        )}

        <div className="mt-6 text-center">
          <Button type="submit" disabled={authStore.loading}>
            {authStore.loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
});

export default Register;
