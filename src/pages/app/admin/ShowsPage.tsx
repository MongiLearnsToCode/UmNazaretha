import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { syncBunnyVideos } from '../../../lib/bunny';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Dialog from '../../../components/ui/Dialog';
import type { Show } from '../../../lib/types/database';

export default function ShowsPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingShowId, setDeletingShowId] = useState<string | null>(null);
  const [deletingShow, setDeletingShow] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '00:30:00',
    video_path: '',
    thumbnail_url: ''
  });

  useEffect(() => {
    fetchShows();
  }, []);

  async function fetchShows() {
    try {
      const { data, error } = await supabase
        .from('shows')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setShows(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch shows');
    } finally {
      setLoading(false);
    }
  }

  const handleSync = async () => {
    setSyncing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await syncBunnyVideos();
      await fetchShows();
      setSuccess(
        `Successfully synced ${result.syncedCount} new videos out of ${result.totalVideos} total videos.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync videos');
    } finally {
      setSyncing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (isEditing && editingShow) {
        const { error } = await supabase
          .from('shows')
          .update(formData)
          .eq('id', editingShow.id);

        if (error) throw error;
        setSuccess('Show updated successfully');
      } else {
        const { error } = await supabase
          .from('shows')
          .insert([formData]);

        if (error) throw error;
        setSuccess('Show added successfully');
      }

      setFormData({
        title: '',
        description: '',
        duration: '00:30:00',
        video_path: '',
        thumbnail_url: ''
      });
      setIsEditing(false);
      setEditingShow(null);
      fetchShows();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save show');
    }
  };

  const handleEdit = (show: Show) => {
    setIsEditing(true);
    setEditingShow(show);
    setFormData({
      title: show.title,
      description: show.description || '',
      duration: show.duration,
      video_path: show.video_path,
      thumbnail_url: show.thumbnail_url || ''
    });
  };

  const handleDelete = async () => {
    if (!deletingShowId) return;
    
    setDeletingShow(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('shows')
        .delete()
        .eq('id', deletingShowId);

      if (error) throw error;
      fetchShows();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete show');
    } finally {
      setDeletingShow(false);
      setShowDeleteDialog(false);
      setDeletingShowId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-gray-400">Loading shows...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Shows</h1>
        <div className="flex space-x-4">
          <Button
            variant="secondary"
            icon={RefreshCw}
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? 'Syncing...' : 'Sync from Bunny.net'}
          </Button>
          {!isEditing && (
            <Button variant="primary" icon={Plus} onClick={() => setIsEditing(true)}>
              Add Show
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-emerald-500 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {success}
        </div>
      )}

      {(isEditing || shows.length === 0) && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            {isEditing ? 'Edit Show' : 'Add New Show'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-emerald-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Duration (HH:MM:SS)
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Video Path
              </label>
              <input
                type="text"
                value={formData.video_path}
                onChange={(e) => setFormData({ ...formData, video_path: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-md text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex space-x-4">
              <Button type="submit" variant="primary">
                {isEditing ? 'Update Show' : 'Add Show'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  setEditingShow(null);
                  setFormData({
                    title: '',
                    description: '',
                    duration: '00:30:00',
                    video_path: '',
                    thumbnail_url: ''
                  });
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {shows.length > 0 && !isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {shows.map((show) => (
            <Card key={show.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{show.title}</h3>
                  <p className="text-sm text-emerald-500">Duration: {show.duration}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Pencil}
                    onClick={() => handleEdit(show)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => {
                      setDeletingShowId(show.id);
                      setShowDeleteDialog(true);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              {show.description && (
                <p className="text-gray-400 text-sm mb-4">{show.description}</p>
              )}
              <div className="text-sm text-gray-500">
                <p>Video: {show.video_path}</p>
                {show.thumbnail_url && <p>Thumbnail: {show.thumbnail_url}</p>}
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingShowId(null);
        }}
        onConfirm={handleDelete}
        title="Delete Show"
        message="Are you sure you want to delete this show? This action cannot be undone."
        confirmText="Delete"
        loading={deletingShow}
      />
    </div>
  );
}