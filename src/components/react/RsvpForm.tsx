import { useState } from 'react';
import { useForm } from 'react-hook-form';

type RsvpFormData = {
  name: string;
  guests: number;
  allergies: string;
  song: string;
};

type RsvpFormProps = {
  formId?: string;
};

export default function RsvpForm({ formId }: RsvpFormProps) {
  const [message, setMessage] = useState('');
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RsvpFormData>();

  const onSubmit = async (data: RsvpFormData) => {
    if (!formId) {
      setMessage('Il modulo RSVP non è ancora configurato.');
      return;
    }

    setMessage('');

    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Formspree submission failed');
      }

      reset();
      setMessage('Grazie! La vostra risposta è stata inviata.');
    } catch {
      setMessage('Invio non riuscito. Riprova tra qualche istante.');
    }
  };

  return (
    <form
      className="grid gap-4.5"
      noValidate
      onSubmit={handleSubmit(onSubmit)}
    >
      <label className="form-label">
        Il tuo nome
        <input
          type="text"
          placeholder="Nome e cognome"
          aria-invalid={Boolean(errors.name)}
          {...register('name', { required: 'Inserisci il tuo nome.' })}
        />
        {errors.name && <span role="alert">{errors.name.message}</span>}
      </label>
      <label className="form-label">
        Quanti sarete?
        <input
          type="number"
          inputMode="numeric"
          min={1}
          step={1}
          placeholder="Numero di ospiti"
          aria-invalid={Boolean(errors.guests)}
          {...register('guests', {
            required: 'Inserisci il numero di ospiti.',
            valueAsNumber: true,
            min: { value: 1, message: 'Inserisci almeno un ospite.' },
            validate: (value) =>
              Number.isInteger(value) || 'Inserisci un numero intero.',
          })}
        />
        {errors.guests && <span role="alert">{errors.guests.message}</span>}
      </label>
      <label className="form-label">
        Allergie o intolleranze
        <textarea
          rows={2}
          placeholder="Scrivici qui, se necessario"
          {...register('allergies')}
        />
      </label>
      <label className="form-label">
        La vostra canzone d'amore preferita 🩵
        <input
          type="text"
          placeholder="Titolo e artista"
          aria-invalid={Boolean(errors.song)}
          {...register('song', {
            required: 'Indica la vostra canzone d’amore preferita.',
          })}
        />
        {errors.song && <span role="alert">{errors.song.message}</span>}
      </label>
      <button
        className="button button-primary mt-3.5 justify-self-start"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Invio in corso...' : 'Conferma'}{' '}
        <span aria-hidden="true">↗</span>
      </button>
      <p aria-live="polite" role="status">
        {message}
      </p>
    </form>
  );
}