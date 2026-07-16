import { useEffect, useState } from 'react';
import type React from 'react';
import { createSampleName, getSampleNames } from '../api/sampleNamesApi';
import type { SampleName } from '../../../shared/types/sampleName';

const maxLength = 10;

export function SampleNamesModule() {
  const [name, setName] = useState('');
  const [sampleNames, setSampleNames] = useState<SampleName[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    void loadSampleNames();
  }, []);

  async function loadSampleNames() {
    try {
      const data = await getSampleNames();
      setSampleNames(data);
    } catch {
      setError('Failed to load sample names.');
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = name.trim();
    if (trimmedName.length === 0) {
      setError('Name is required.');
      return;
    }

    if (trimmedName.length > maxLength) {
      setError(`Name must be ${maxLength} characters or fewer.`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const created = await createSampleName(trimmedName);
      setSampleNames((current) => [created, ...current]);
      setName('');
    } catch (apiError) {
      const details = apiError as { errors?: Record<string, string[]> };
      const firstError = details.errors?.Name?.[0] ?? details.errors?.name?.[0];
      setError(firstError ?? 'Unexpected error while saving.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="sample-names-module">
      <h1>Seeagle</h1>
      <p>Sample Names demo functionality</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="name-input">Name</label>
        <input
          id="name-input"
          value={name}
          maxLength={maxLength}
          onChange={(event) => setName(event.target.value)}
          placeholder="Up to 10 chars"
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Add'}
        </button>
      </form>

      <p className="hint">Validation: required, maximum {maxLength} characters.</p>
      {error && <p className="error">{error}</p>}

      <ul>
        {sampleNames.map((sampleName) => (
          <li key={sampleName.id}>
            <strong>{sampleName.name}</strong>
            <span>{new Date(sampleName.createdUtc).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
