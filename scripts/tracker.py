import supervision as sv

tracker = sv.ByteTrack(
    track_activation_threshold=0.5,
    lost_track_buffer=30,
    minimum_matching_threshold=0.8,
    frame_rate=30
)