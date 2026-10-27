const API_URL = 'http://api.favorit-parts.ru/hs/hsprice/'
const API_KEY = import.meta.env?.VITE_API_KEY || '00000000-0000-0000-0000-000000000001'

// если ничего не найдено, апи возвращает пустую запись
export function parseGoods(json) {
  if (json.error) throw new Error(json.error)
  return (json.goods || []).filter((g) => g.brand)
}

export async function fetchGoods(params) {
  const query = new URLSearchParams({ key: API_KEY, ...params })
  let res
  try {
    res = await fetch(`${API_URL}?${query}`)
  } catch {
    throw new Error('Сбой сети: сервис недоступен')
  }
  if (!res.ok) throw new Error(`Ошибка сервера: ${res.status}`)
  return parseGoods(await res.json())
}
