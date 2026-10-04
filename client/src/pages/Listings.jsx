import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../hooks/useAuth'

export default function Listings() {
  const { user } = useAuth()
  const [listings, setListings] = useState([])
  const [error, setError] = useState('')

  async function load() {
    const res = await api.get('/listings')
    setListings(res.data.listings)
  }

  useEffect(() => { load() }, [])

  // The server soft-deletes (status -> 'removed'), so we just hide it here.
  async function onRemove(id) {
    setError('')
    try {
      await api.delete('/listings/' + id)
      setListings(prev => prev.filter(l => l._id !== id))
    } catch (err) {
      setError(err?.response?.data?.message || 'Remove failed')
    }
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {listings.map(l => {
          const isMine = user && l.seller?._id === user.id
          return (
            <div key={l._id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{l.title} • {l.price}</div>
                  <div className="text-sm text-zinc-600">
                    {l.category} • {l.condition} • {l.status} • by {l.seller?.name || 'unknown'}
                  </div>
                </div>
                {isMine && (
                  <div className="flex gap-2">
                    <Link to={`/listings/${l._id}`} className="btn text-sm">Edit</Link>
                    <button onClick={() => onRemove(l._id)} className="btn text-sm">Remove</button>
                  </div>
                )}
              </div>
              {l.description && <p className="mt-2 text-sm">{l.description}</p>}
            </div>
          )
        })}
        {listings.length === 0 && <div className="text-sm text-zinc-600">No listings yet.</div>}
      </div>
    </div>
  )
}
