<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoupleSong extends Model
{
    protected $fillable = ['connection_id', 'title', 'artist', 'file_path'];

    public function connection()
    {
        return $this->belongsTo(Connection::class);
    }
}
