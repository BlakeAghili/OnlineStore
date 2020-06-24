using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ServerApp.Models;
using ServerApp.Models.BindingTargets;

namespace ServerApp.Controllers
{
    [Route("api/suppliers")]
    public class SupplierValuesController: Controller
    {
        private DataContext context;

        public SupplierValuesController(DataContext ctx)
        {
            context = ctx;
        }

        [HttpGet]
        public IEnumerable<Supplier> GetSuppliers()
        {
            return context.Suppliers;
        }

        [HttpPost]
        public IActionResult CreateSupplier([FromBody] SupplierData sData)
        {
            if (ModelState.IsValid)
            {
                Supplier s = sData.Supplier;
                context.Add(s);
                context.SaveChanges();
                return Ok(s.SupplierId);
            }
            else
            {
                return BadRequest(ModelState);
            }
            //.
        }
    }
}
