<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CouplePlan extends Model
{
    protected $fillable = ['connection_id', 'plan'];

    public function connection()
    {
        return $this->belongsTo(Connection::class);
    }
}
