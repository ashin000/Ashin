import { useEffect, useState } from 'react';
import { ArrowLeft, ImagePlus, LockKeyhole, LogOut, Plus, Save, ShieldCheck, Trash2, X } from 'lucide-react';
import { defaultPortfolioContent } from '../../data/defaultPortfolioContent';
import type { EditableItem, EditableValue, PortfolioContent } from '../../data/portfolioContent';

const sections: { key: keyof PortfolioContent; label: string }[] = [
  { key: 'profile', label: 'Hero / Profile' },
  { key: 'about', label: 'About' },
  { key: 'contact', label: 'Contact details' },
  { key: 'experience', label: 'Experience' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'certificates', label: 'Certificates' },
  { key: 'services', label: 'Services' },
  { key: 'stats', label: 'Stats' },
];

const fieldClass = 'w-full rounded-xl border border-white/10 bg-[#080d19] px-3.5 py-3 text-sm text-slate-100 outline-none transition focus:border-blue-400/70 focus:ring-2 focus:ring-blue-400/10';
const labelClass = 'mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400';
const MAX_UPLOAD_BYTES = 180 * 1024;

async function optimizeImage(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Choose a JPG, PNG, or WebP image.');
  }
  if (file.size > 15 * 1024 * 1024) throw new Error('Choose an image smaller than 15 MB.');

  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement('canvas');
  const initialScale = Math.min(1, 1400 / bitmap.width, 1400 / bitmap.height);
  let scale = initialScale;
  let blob: Blob | null = null;

  while (scale >= 0.25) {
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not process this image in the browser.');
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    for (const quality of [0.82, 0.7, 0.58, 0.46]) {
      blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
      if (blob && blob.size <= MAX_UPLOAD_BYTES) break;
    }
    if (blob && blob.size <= MAX_UPLOAD_BYTES) break;
    scale *= 0.75;
  }
  bitmap.close();
  if (!blob || blob.size > MAX_UPLOAD_BYTES) throw new Error('This image could not be compressed enough. Try a smaller image.');

  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Could not read the optimized image.'));
    reader.onerror = () => reject(new Error('Could not read the optimized image.'));
    reader.readAsDataURL(blob);
  });
}

function parseContent(value: unknown): PortfolioContent | null {
  if (!value || typeof value !== 'object') return null;
  const candidate = value as Record<string, unknown>;
  if (sections.some(({ key }) => !(key in candidate))) return null;
  const certificates = Array.isArray(candidate.certificates)
    ? candidate.certificates.map((certificate) => (
      certificate && typeof certificate === 'object'
        ? { imageUrl: '', ...(certificate as Record<string, unknown>) }
        : certificate
    ))
    : candidate.certificates;
  return { ...candidate, certificates } as unknown as PortfolioContent;
}

function blankItem(template?: EditableItem): EditableItem {
  if (!template) return { id: `item-${Date.now()}`, title: '', description: '' };
  return Object.fromEntries(Object.entries(template).map(([key, value]) => [
    key,
    key === 'id' ? `item-${Date.now()}` : Array.isArray(value) ? [] : typeof value === 'number' ? 0 : typeof value === 'boolean' ? false : '',
  ]));
}

function inputValue(rawValue: string, previous: EditableValue): EditableValue {
  if (typeof previous === 'number') return rawValue === '' ? 0 : Number(rawValue);
  if (Array.isArray(previous)) return rawValue.split('\n').map((item) => item.trim()).filter(Boolean);
  return rawValue;
}

export default function AdminApp() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [content, setContent] = useState<PortfolioContent>(defaultPortfolioContent);
  const [activeSection, setActiveSection] = useState<keyof PortfolioContent>('profile');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/admin/session')
      .then((response) => response.json())
      .then(async (session: { authenticated?: boolean }) => {
        if (!active) return;
        const isAuthenticated = Boolean(session.authenticated);
        setAuthenticated(isAuthenticated);
        if (isAuthenticated) {
          try {
            await loadSavedContent();
          } catch (error) {
            setNotice(error instanceof Error ? error.message : 'Could not load saved content.');
          }
        }
      })
      .catch(() => { if (active) setAuthenticated(false); });
    return () => { active = false; };
  }, []);

  const loadSavedContent = async () => {
    const response = await fetch('/api/admin/content');
    if (!response.ok) throw new Error((await response.json()).error ?? 'Could not load saved content.');
    const saved = parseContent(await response.json());
    if (saved) setContent(saved);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setNotice('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Login failed.');
      setAuthenticated(true);
      setCredentials({ username: '', password: '' });
      await loadSavedContent();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  };

  const handleSave = async () => {
    setBusy(true);
    setNotice('');
    try {
      const response = await fetch('/api/admin/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? 'Could not save changes.');
      setNotice('Changes saved. They are now live on the public portfolio.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save changes.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  const currentValue = content[activeSection];
  const isList = Array.isArray(currentValue);
  const items = (isList ? currentValue : [currentValue]) as EditableItem[];
  const updateField = (itemIndex: number, field: string, value: EditableValue) => {
    setContent((previous) => {
      const sectionValue = previous[activeSection];
      if (Array.isArray(sectionValue)) {
        const nextItems = [...sectionValue];
        nextItems[itemIndex] = { ...nextItems[itemIndex], [field]: value };
        return { ...previous, [activeSection]: nextItems };
      }
      return { ...previous, [activeSection]: { ...sectionValue, [field]: value } };
    });
  };
  const addItem = () => setContent((previous) => {
    const existingItems = previous[activeSection] as EditableItem[];
    return { ...previous, [activeSection]: [...existingItems, blankItem(existingItems[0])] };
  });
  const handleImageUpload = async (file: File | undefined, itemIndex: number, field: string) => {
    if (!file) return;
    const uploadKey = `${activeSection}-${itemIndex}-${field}`;
    setUploading(uploadKey);
    setNotice('Optimizing image…');
    try {
      const imageData = await optimizeImage(file);
      updateField(itemIndex, field, imageData);
      setNotice('Image added. Select “Save and publish” to save it.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not upload this image.');
    } finally {
      setUploading(null);
    }
  };

  if (authenticated === null) {
    return <div className="min-h-screen bg-white" aria-label="Checking admin session" />;
  }

  if (!authenticated) {
    return (
      <main className="theme-light grid min-h-screen place-items-center bg-white px-5 py-12 text-slate-900">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0b1220] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-9">
          <a href="/" className="mb-10 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Back to portfolio
          </a>
          <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-400/10 text-blue-300">
            <LockKeyhole className="h-5 w-5" />
          </div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">Private area</p>
          <h1 className="text-3xl font-bold tracking-tight">Admin sign in</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Sign in to manage the content shown on your portfolio.</p>
          <form onSubmit={handleLogin} className="mt-8 space-y-5">
            <label className="block">
              <span className={labelClass}>Username</span>
              <input autoComplete="username" required value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} className={fieldClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Password</span>
              <input type="password" autoComplete="current-password" required value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} className={fieldClass} />
            </label>
            {notice && <p role="alert" className="rounded-xl border border-rose-400/20 bg-rose-400/5 px-4 py-3 text-sm text-rose-200">{notice}</p>}
            <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-wait disabled:opacity-60">
              <ShieldCheck className="h-4 w-4" /> {busy ? 'Checking…' : 'Sign in securely'}
            </button>
          </form>
          <p className="mt-5 text-xs leading-5 text-slate-400">Admin credentials are checked by the Cloudflare server and are never stored in this page.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="theme-light min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-[#050816]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">Portfolio CMS</p>
            <h1 className="mt-1 text-lg font-bold">Admin dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="hidden items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5 sm:inline-flex"><ArrowLeft className="h-4 w-4" /> View site</a>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"><LogOut className="h-4 w-4" /> Sign out</button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] gap-6 px-4 py-7 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
          {sections.map((section) => (
            <button key={section.key} onClick={() => setActiveSection(section.key)} className={`shrink-0 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${activeSection === section.key ? 'bg-blue-500/15 text-blue-200 ring-1 ring-blue-400/25' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              {section.label}
            </button>
          ))}
        </aside>

        <section className="min-w-0 rounded-3xl border border-white/10 bg-[#0a101d] p-5 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">Content editor</p>
              <h2 className="mt-1 text-2xl font-bold">{sections.find(({ key }) => key === activeSection)?.label}</h2>
            </div>
            {isList && <button onClick={addItem} className="inline-flex items-center gap-2 rounded-xl border border-blue-400/25 bg-blue-400/10 px-4 py-2.5 text-sm font-bold text-blue-200 hover:bg-blue-400/15"><Plus className="h-4 w-4" /> Add item</button>}
          </div>

          <div className="space-y-5">
            {items.map((item, itemIndex) => (
              <article key={String(item.id ?? `${activeSection}-${itemIndex}`)} className="rounded-2xl border border-white/10 bg-[#080d19] p-4 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-200">{String(item.title ?? item.name ?? item.category ?? `Item ${itemIndex + 1}`)}</h3>
                  {isList && <button aria-label={`Delete item ${itemIndex + 1}`} onClick={() => setContent((previous) => ({ ...previous, [activeSection]: (previous[activeSection] as EditableItem[]).filter((_, index) => index !== itemIndex) }))} className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-400/10 hover:text-rose-300"><Trash2 className="h-4 w-4" /></button>}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(item).map(([field, value]) => {
                    if (field === 'icon' || field === 'iconKey') return null;
                    if (field === 'imageUrl') {
                      const uploadKey = `${activeSection}-${itemIndex}-${field}`;
                      return (
                        <div key={field} className="md:col-span-2">
                          <span className={labelClass}>{field === 'imageUrl' && activeSection === 'certificates' ? 'Certificate image' : 'Profile image'}</span>
                          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-white/15 bg-white/[0.02] p-4">
                            {typeof value === 'string' && value ? (
                              <div className="relative h-24 w-36 overflow-hidden rounded-lg border border-white/10 bg-black/20">
                                <img src={value} alt="Current upload preview" className="h-full w-full object-contain" />
                                <button type="button" aria-label="Remove uploaded image" onClick={() => updateField(itemIndex, field, '')} className="absolute right-1 top-1 rounded-md bg-black/75 p-1 text-white hover:bg-rose-500"><X className="h-3.5 w-3.5" /></button>
                              </div>
                            ) : (
                              <div className="grid h-24 w-36 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-400"><ImagePlus className="h-7 w-7" /></div>
                            )}
                            <div className="min-w-[180px] flex-1">
                              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-blue-400/25 bg-blue-400/10 px-3.5 py-2.5 text-xs font-bold text-blue-100 transition hover:bg-blue-400/20">
                                <ImagePlus className="h-4 w-4" />
                                {uploading === uploadKey ? 'Optimizing…' : value ? 'Choose another image' : 'Choose image'}
                                <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading !== null} onChange={(event) => { void handleImageUpload(event.target.files?.[0], itemIndex, field); event.currentTarget.value = ''; }} className="sr-only" />
                              </label>
                              <p className="mt-2 text-xs leading-5 text-slate-400">JPG, PNG, or WebP. Images are optimized in your browser and saved with your content (up to 180 KB each).</p>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    const longText = typeof value === 'string' && (value.length > 100 || /description|summary|solution|problem|architecture|challenge|lesson|paragraph|intro|mission|vision|values/i.test(field));
                    return (
                      <label key={field} className={`block ${longText || Array.isArray(value) ? 'md:col-span-2' : ''}`}>
                        <span className={labelClass}>{field.replace(/[A-Z]/g, (letter) => ` ${letter}`).replaceAll('_', ' ')}</span>
                        {Array.isArray(value) ? (
                          <textarea rows={Math.min(Math.max(value.length + 2, 4), 10)} value={value.join('\n')} onChange={(event) => updateField(itemIndex, field, inputValue(event.target.value, value))} className={`${fieldClass} resize-y font-mono text-xs leading-6`} placeholder="One entry per line" />
                        ) : typeof value === 'boolean' ? (
                          <input type="checkbox" checked={value} onChange={(event) => updateField(itemIndex, field, event.target.checked)} className="h-5 w-5 accent-blue-500" />
                        ) : longText ? (
                          <textarea rows={4} value={String(value ?? '')} onChange={(event) => updateField(itemIndex, field, inputValue(event.target.value, value))} className={`${fieldClass} resize-y leading-6`} />
                        ) : (
                          <input type={typeof value === 'number' ? 'number' : 'text'} value={String(value ?? '')} onChange={(event) => updateField(itemIndex, field, inputValue(event.target.value, value))} className={fieldClass} />
                        )}
                      </label>
                    );
                  })}
                </div>
              </article>
            ))}
            {items.length === 0 && <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-slate-400">No items yet. Use “Add item” to create one.</div>}
          </div>

          <div className="sticky bottom-4 mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#111a2a]/95 p-3 backdrop-blur-xl">
            <p aria-live="polite" className="px-2 text-xs text-slate-300">{notice}</p>
            <button disabled={busy} onClick={handleSave} className="inline-flex items-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600 disabled:cursor-wait disabled:opacity-60"><Save className="h-4 w-4" /> {busy ? 'Saving…' : 'Save and publish'}</button>
          </div>
        </section>
      </div>
    </main>
  );
}
