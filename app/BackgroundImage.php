<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Sofa\Eloquence\Eloquence;
use Sofa\Eloquence\Mappable;
use Auth;
use Carbon\Carbon;
use Storage;


class BackgroundImage extends ApiModel
{

	use Eloquence, Mappable;


	/**
	 * The name of the table for this model, also for the permissions set for this model
	 * @var string
	 */
	protected $table = 'background_images';

	/**
	 * The attributes that are fillable by a creator of the model
	 * @var array
	 */
	protected $fillable = ['credited','url','file_id'];

	/**
	 * The attributes fillable by the administrator of this model
	 * @var array
	 */
	protected $adminFillable = ['active', 'display_date'];
	
	/**
	 * The attributes included in the JSON/Array
	 * @var array
	 */
	protected $visible = ['id','file_id','display_date','url','credited','title','filename', 'active'];
	
	/**
	 * The attributes visible to an administrator of this model
	 * @var array
	 */
	protected $adminVisible = ['active','user_id'];

	/**
	 * The attributes visible to the user that created this model
	 * @var array
	 */
	protected $creatorVisible = ['active','user_id'];

	/**
	 * The mapped attributes for 1:1 relations
	 * @var array
	 */
   	protected $maps = [
     	'title' 				=> 	'file.title',
     	'image'					=>	'file.image',
     	'filename'				=>	'file.filename',
     	'file_category_name'	=>	'file.filecategory.name' //Should always be background_images
    ];

	/**
	 * The attributes appended and returned (if visible) to the user
	 * @var array
	 */	
    protected $appends = ['filename'];

    /**
     * The rules for all the variables
     * @var array
     */
	protected $rules = [
        'active'			=>	'boolean',
        'file_id'			=>	'integer|unique:background_images,file_id',
        'display_date' 		=>	'date|unique:background_images,display_date',
        'url'				=>	'url',
        'user_id'			=>	'integer|exists:users,id',
        'id'				=>	'integer'
	];

	/**
	 * The variables that are required when you do an update
	 * @var array
	 */
	protected $onUpdateRequired = ['id'];

	/**
	 * The variables requied when you do the initial create
	 * @var array
	 */
	protected $onCreateRequired = ['file_id','user_id'];

	/**
	 * Fields that are unique so that the ID of this field can be appended to them in update validation
	 * @var array
	 */
	protected $unique = ['display_date','file_id'];

	/**
	 * The front end field details for the attributes in this model 
	 * @var array
	 */
	protected $fields = [
		'active'	 			=>	['tag'=>'md-switch','type'=>'X','label'=>'Attribute Name','placeholder'=>''],
		'file_id'	 			=>	['tag'=>'file','type'=>'text','label'=>'Title','placeholder'=>'The unique title of your motion'],
		'display_date'	 		=>	['tag'=>'date','type'=>'X','label'=>'Attribute Name','placeholder'=>''],
		'url'	 				=>	['tag'=>'input','type'=>'url','label'=>'Attribute Name','placeholder'=>''],
	];

	/**
	 * The fields that are locked. When they are changed they cause events like resetting people's accounts
	 * @var array
	 */
	public $locked = ['file_id'];

	/**
     * The attributes that should be mutated to dates.
     * @var array
     */
    protected $dates = ['created_at', 'updated_at', 'display_date'];


	/**************************************** Standard Methods **************************************** */
	public static function boot(){
		parent::boot();

		static::creating(function($model){
			return $model->validate();	
		});

		static::updating(function($model){
			return $model->validate();			
		});


		static::deleted(function($model){
	        $model->file->delete();
	        return true;
		});
	}


	/************************************* Custom Methods *******************************************/
	
	public function random(){
		return BackgroundImage::orderByRaw("RAND()")->active()->first();
	}

	public function today(){
		return BackgroundImage::whereNotNull('display_date')->where('display_date','<=',Carbon::now())->active()->orderBy('display_date','desc')->first();

	}
	
	/************************************* Getters & Setters ****************************************/


	/**
	 * @return Overrides the API Model, will see if it can be intergrated into it
	 */
	public function getVisibleAttribute(){
		if(!Auth::check()){
			return $this->visible;
		}
		return parent::getVisibleAttribute();
	}


	/**
	 * @param boolean checks that the user is an admin, returns false if not. Automatically sets the closing time to be one week out from now.
	 */
	public function setActiveAttribute($value){
		if(!Auth::user()->can('administrate-background_images')){
			return false;
		}

		$this->attributes['active'] = $value;

		if($value){ //Setting it  active
			$last = BackgroundImage::whereNotNull('display_date')->active()->orderBy('display_date','desc')->first();
			if(!$last){
				$last = Carbon::yesterday();
			} else {
				$last = $last->display_date;
			}
			
			$this->attributes['display_date'] = $last->add(new \DateInterval('P1D'))->format('Y-m-d');
		} else { //Setting it inactive
			$this->attributes['display_date'] = null;
		}	

		return true;
	}

	/************************************* Casts & Accesors *****************************************/

	public function scopeActive($query){
		return $query->where('active',1);
	}

	/************************************* Scopes ***************************************************/


	/************************************* Relationships ********************************************/

	public function user(){
		return $this->belongsTo('App\User');
	}

	public function file(){
		return $this->belongsTo('App\File');
	}

}
