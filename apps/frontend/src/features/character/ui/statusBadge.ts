const STATUS_CLASSES: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  DRAFT: 'bg-yellow-100 text-yellow-800',
  ARCHIVED: 'bg-zinc-100 text-zinc-600',
}

export function getCharacterStatusClass(status: string): string {
  return STATUS_CLASSES[status] ?? 'bg-zinc-100 text-zinc-600'
}
