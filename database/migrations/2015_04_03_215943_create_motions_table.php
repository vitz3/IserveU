<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateMotionsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('motions', function(Blueprint $table) {
            $table->increments('id');
            $table->string('title');
            $table->string('summary');
            $table->text('text');

        	$table->integer('department_id')->unsigned()->default(1);
            $table->dateTime('closing')->nullable()->default(null);
            $table->integer('user_id')->unsigned();
            $table->tinyInteger('status')->default(0)->unsigned(); 

            $table->softDeletes();            
            $table->timestamps();
        });

        Schema::table('motions', function($table){
 			$table->foreign('user_id')->references('id')->on('users');
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
        Schema::table('motions', function($table){
            $table->dropForeign('motions_user_id_foreign');
        });

		Schema::drop('motions');
	}

}
