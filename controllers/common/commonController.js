const express = require('express');
const schoolUdise = require('../../models/school_udise');
const {sequalize} = require('../../config/config');
const successResponse = require('../../utils/successResponse');
const customError = require('../../utils/customError');

const getSchoolDetails  = async (req, res) =>{
        const {udise_sch_code} = req.body; 
    try{
        const schDetails = await schoolUdise.findByPk(udise_sch_code);
        if(!schDetails){
            throw new customError('School Udise not found',404);
           }
           
        successResponse(res, 200 , 'Successfully fetched Schhool Details',{
            udise_sch_code: schDetails.udise_sch_code,
            school_name: schDetails.school_name,
            school_category: schDetails.sch_category_id,
            school_type: schDetails.sch_type,
            management: schDetails.sch_mgmt_id,

            district_name: schDetails.district_name,
            district_cd: schDetails.district_cd,
            block_name: schDetails.block_name,
            block_cd: schDetails.block_cd,
            cluster_name: schDetails.cluster_name,
            cluster_cd: schDetails.cluster_cd,
            assembly_name: schDetails.assembly_name,
            assembly_cons_cd: schDetails.assembly_cons_cd,
            latitude: schDetails.latitude,
            longitude: schDetails.longitude,


        });
       

    }catch(error){
        if (error instanceof customError) {
            return error.sendErrorResponse(res);
          }
          const genericError = new customError();
          return genericError.sendErrorResponse(res);
    }
}

module.exports={
    getSchoolDetails,
}