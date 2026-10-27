import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { reset, searchBrands, searchOffers } from './store.js'

const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' })

function Status({ state, empty, children }) {
  if (state.status === 'loading')
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
    )
  if (state.status === 'error') return <div className="alert alert-danger">{state.error}</div>
  if (state.status === 'done' && !state.items.length) return <div className="alert alert-secondary">{empty}</div>
  return state.status === 'done' ? children : null
}

export default function App() {
  const dispatch = useDispatch()
  const { brands, offers, selected } = useSelector((s) => s.parts)
  const [number, setNumber] = useState('')
  const query = number.trim()

  useEffect(() => {
    if (!query) {
      dispatch(reset())
      return
    }
    const t = setTimeout(() => dispatch(searchBrands(query)), 400)
    return () => clearTimeout(t)
  }, [query, dispatch])

  return (
    <div className="container py-4" style={{ maxWidth: 960 }}>
      <h1 className="h3 mb-4">Поиск автозапчастей и аналогов</h1>

      <label htmlFor="number" className="form-label">Артикул</label>
      <input
        id="number"
        className="form-control form-control-lg mb-4"
        placeholder="Например, 0189"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        autoFocus
      />

      <Status state={brands} empty="По этому артикулу ничего не найдено">
        <h2 className="h5">Производители</h2>
        <div className="list-group mb-4">
          {brands.items.map((g) => (
            <button
              key={g.goodsID}
              type="button"
              className={`list-group-item list-group-item-action d-flex justify-content-between ${selected === g.brand ? 'active' : ''}`}
              onClick={() => dispatch(searchOffers({ number: query, brand: g.brand }))}
            >
              <span><strong>{g.brand}</strong> {g.number}</span>
              <span className="text-truncate ms-3">{g.name}</span>
            </button>
          ))}
        </div>
      </Status>

      <Status state={offers} empty="Предложений не найдено">
        <h2 className="h5">Аналоги и предложения</h2>
        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead>
              <tr>
                <th>Производитель</th>
                <th>Артикул</th>
                <th>Название</th>
                <th className="text-end">Цена</th>
                <th className="text-end">Остаток</th>
              </tr>
            </thead>
            <tbody>
              {offers.items.map((g, i) => (
                <tr key={`${g.goodsID}-${i}`}>
                  <td>{g.brand}</td>
                  <td>{g.number}</td>
                  <td>{g.name}</td>
                  <td className="text-end text-nowrap">{g.price ? money.format(g.price) : '-'}</td>
                  <td className="text-end">{g.count ? `${g.count} шт.` : 'нет'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Status>
    </div>
  )
}
