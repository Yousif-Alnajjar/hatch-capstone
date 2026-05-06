import { useNavigate } from 'react-router-dom';

export default function BackButton({ to, label = 'back' }) {
  const navigate = useNavigate();
  const onClick = () => (to ? navigate(to) : navigate(-1));
  return (
    <button onClick={onClick} className="btn btn-ghost" type="button">
      {label}
    </button>
  );
}
