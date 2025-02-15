
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import VideoBackground from '@/components/VideoBackground';
import AudioPlayer from '@/components/AudioPlayer';

const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            media(*)
          `)
          .eq('username', username)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center">Profile not found</div>;
  }

  return (
    <div className="min-h-screen relative">
      {profile.background_video_url && (
        <VideoBackground src={profile.background_video_url} />
      )}
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="glass-dark p-8 rounded-2xl max-w-2xl w-full space-y-6">
          <div className="text-center space-y-4">
            {profile.avatar_url && (
              <img
                src={profile.avatar_url}
                alt={profile.display_name}
                className="w-24 h-24 rounded-full mx-auto object-cover"
              />
            )}
            <h1 className="text-3xl font-bold">{profile.display_name}</h1>
            {profile.bio && (
              <p className="text-muted-foreground">{profile.bio}</p>
            )}
          </div>

          {profile.background_audio_url && (
            <div className="mt-8">
              <AudioPlayer src={profile.background_audio_url} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
