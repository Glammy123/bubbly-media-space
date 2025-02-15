
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import MediaUpload from '@/components/MediaUpload';

const Create = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    display_name: '',
    bio: '',
    theme_color: '#000000',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        theme_color: profile.theme_color || '#000000',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleMediaUpload = async (file: File, type: 'audio' | 'video') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-media')
        .getPublicUrl(filePath);

      // Update profile with new media URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          [type === 'audio' ? 'background_audio_url' : 'background_video_url']: publicUrl
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Add to media table
      const { error: mediaError } = await supabase
        .from('media')
        .insert({
          user_id: user?.id,
          url: publicUrl,
          type
        });

      if (mediaError) throw mediaError;

      toast.success(`${type} uploaded successfully`);
    } catch (error: any) {
      toast.error(`Error uploading ${type}: ${error.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      navigate(`/${formData.username}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Create Your Profile</h1>
          <Button variant="ghost" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="your-username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="display_name">Display Name</Label>
            <Input
              id="display_name"
              name="display_name"
              value={formData.display_name}
              onChange={handleChange}
              placeholder="Your Name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme_color">Theme Color</Label>
            <Input
              id="theme_color"
              name="theme_color"
              type="color"
              value={formData.theme_color}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-4">
            <Label>Background Video</Label>
            <MediaUpload onUpload={(file) => handleMediaUpload(file, 'video')} type="video" />
          </div>

          <div className="space-y-4">
            <Label>Background Audio</Label>
            <MediaUpload onUpload={(file) => handleMediaUpload(file, 'audio')} type="audio" />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Create;
