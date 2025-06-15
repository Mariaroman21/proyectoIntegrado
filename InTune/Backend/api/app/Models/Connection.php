<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Connection extends Model
{
    protected $fillable = [
        'user_id',
        'connected_user_id',
        'type',
        'name',
        'start_date',
    ];


    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function connectedUser()
    {
        return $this->belongsTo(User::class, 'connected_user_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'connection_user')
            ->withTimestamps()
            ->withPivot('permissions');
    }


    public function songs()
    {
        return $this->hasMany(CoupleSong::class);
    }

    public function plans()
    {
        return $this->hasMany(CouplePlan::class);
    }

    public function timeLine()
    {
        return $this->hasMany(CoupleTimeline::class);
    }



}
