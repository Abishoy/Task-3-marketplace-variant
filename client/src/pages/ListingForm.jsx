import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

// The Sell an Item page. Routed at /listings/new (sell) and /listings/:id (edit),
// and both routes are wrapped in <ProtectedRoute>.

const defaults = { title: '', description: '', price: 0, category: 'other', condition: 'used', status: 'active' }

// The server's validation messages look like: "price" must be greater than or equal to 0
// Drop the quotes and capitalise so it reads: Price must be greater than or equal to 0
function readable(message) {
  const text = message.replace(/"/g, '')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export default function ListingForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')
  // highlight the price box when the server complained about the price
  const priceError = error.toLowerCase().includes('price')

  // Edit mode: load the listing and copy only the fields the form edits.
  // The response also contains seller, _id, timestamps... which must not be sent back.
  useEffect(() => {
    if (!id) return
    api.get('/listings/' + id)
      .then(res => {
        const l = res.data.listing
        setForm({
          title: l.title,
          price: l.price,
          category: l.category,
          condition: l.condition,
          status: l.status,
          description: l.description || ''
        })
      })
      .catch(err => setError(err?.response?.data?.message || 'Could not load listing'))
  }, [id])

  // One handler for every input: `name` says which field changed.
  // Price is stored as a number, except while the box is empty or half-typed
  // (e.g. just "-"), where the browser reports '' — keep that as '' so it isn't
  // turned into 0 and wiped.
  function onChange(e) {
    const { name, value } = e.target
    let next = value
    if (name === 'price') next = value === '' ? '' : Number(value)
    setForm(prev => ({ ...prev, [name]: next }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      if (id) await api.patch('/listings/' + id, form)
      else await api.post('/listings', form)
      nav('/listings')
    } catch (err) {
      setError(readable(err?.response?.data?.message || 'Save failed'))
    }
  }

  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">{id ? 'Edit' : 'New'} Listing</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="input" name="title" placeholder="Title" value={form.title} onChange={onChange} />
        <input
          className={'input ' + (priceError ? 'border-red-400 bg-red-50' : '')}
          name="price" type="number" placeholder="Price" value={form.price} onChange={onChange}
        />
        <select className="input bg-white" name="category" value={form.category} onChange={onChange}>
          <option value="textbooks">Textbooks</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
          <option value="other">Other</option>
        </select>
        <select className="input bg-white" name="condition" value={form.condition} onChange={onChange}>
          <option value="new">New</option>
          <option value="like-new">Like new</option>
          <option value="used">Used</option>
          <option value="worn">Worn</option>
        </select>
        {id && (
          <select className="input bg-white" name="status" value={form.status} onChange={onChange}>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
          </select>
        )}
        <textarea className="input" name="description" placeholder="Description (optional)" rows={3} value={form.description} onChange={onChange} />
        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            <span aria-hidden="true" className="font-bold">!</span>
            <span>{error}</span>
          </div>
        )}
        <button className="btn" type="submit">Save</button>
      </form>
    </div>
  )
}
