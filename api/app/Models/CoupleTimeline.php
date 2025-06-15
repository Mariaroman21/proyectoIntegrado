<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CoupleTimeline extends Model
{
    protected $fillable = ['connection_id', 'event', 'date'];

    protected $casts = [
        'date' => 'date',
    ];

    public function connection()
    {
        return $this->belongsTo(Connection::class);
    }
}
